import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import type { Repository } from 'typeorm';
import { Purchase, ShippingStatus } from '../entity/purchase.entity';
import { CreatePurchaseDTO, UpdateShippingDTO, QueryPurchaseDTO, BatchShippingDTO, SetShippingInfoDTO } from '../dto/purchase.dto';

@Provide()
export class PurchaseService {
    @InjectEntityModel(Purchase)
    purchaseModel: Repository<Purchase>;

    /**
     * 创建购买记录
     */
    async createPurchase(userId: number, data: CreatePurchaseDTO): Promise<Purchase> {
        const purchase = this.purchaseModel.create({
            userId,
            stockId: data.stockId,
            styleId: data.styleId,
            seriesId: data.seriesId,
            seriesName: data.seriesName,
            styleName: data.styleName,
            seriesCover: data.seriesCover,
            styleCover: data.styleCover,
            isHidden: data.isHidden,
            shippingAddress: data.shippingAddress,
            receiverPhone: data.receiverPhone,
            receiverName: data.receiverName,
            shippingStatus: ShippingStatus.PENDING,
            purchasedAt: new Date()
        });

        return this.purchaseModel.save(purchase);
    }

    /**
     * 获取用户的购买记录
     */
    async getUserPurchases(userId: number, query: QueryPurchaseDTO = {}): Promise<{ purchaseIds: number[]; total: number }> {
        const { shippingStatus } = query;

        const queryBuilder = this.purchaseModel.createQueryBuilder('purchase')
            .select('purchase.id') // 只选择ID字段
            .where('purchase.userId = :userId', { userId })
            .orderBy('purchase.purchasedAt', 'DESC');

        if (shippingStatus) {
            queryBuilder.andWhere('purchase.shippingStatus = :shippingStatus', { shippingStatus });
        }

        const purchases = await queryBuilder.getMany();

        // 提取ID列表
        const purchaseIds = purchases.map(purchase => purchase.id);

        return { purchaseIds, total: purchaseIds.length };
    }

    /**
     * 获取所有订单信息（管理员功能）
     */
    async getAllPurchases(query: QueryPurchaseDTO = {}): Promise<{ purchaseIds: number[]; total: number }> {
        const { shippingStatus, page = 1, limit = 20 } = query;

        const queryBuilder = this.purchaseModel.createQueryBuilder('purchase')
            .select('purchase.id') // 只选择ID字段
            .orderBy('purchase.purchasedAt', 'DESC');

        if (shippingStatus) {
            queryBuilder.andWhere('purchase.shippingStatus = :shippingStatus', { shippingStatus });
        }

        // 分页处理
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);

        const purchases = await queryBuilder.getMany();
        const total = await this.purchaseModel.count({
            where: shippingStatus ? { shippingStatus } : {}
        });

        // 提取ID列表
        const purchaseIds = purchases.map(purchase => purchase.id);

        return { purchaseIds, total };
    }

    /**
     * 获取购买记录详情
     */
    async getPurchaseById(id: number): Promise<Purchase | null> {
        return this.purchaseModel.findOne({
            where: { id },
            relations: ['user', 'series', 'style']
        });
    }

    /**
     * 更新物流状态
     */
    async updateShippingStatus(id: number, data: UpdateShippingDTO): Promise<boolean> {
        const updateData: any = {
            shippingStatus: data.shippingStatus,
            updatedAt: new Date()
        };

        if (data.trackingNumber) {
            updateData.trackingNumber = data.trackingNumber;
        }

        if (data.shippingStatus === ShippingStatus.SHIPPED && !data.shippedAt) {
            updateData.shippedAt = new Date();
        }

        if (data.shippingStatus === ShippingStatus.DELIVERED && !data.deliveredAt) {
            updateData.deliveredAt = new Date();
        }

        if (data.shippedAt) {
            updateData.shippedAt = data.shippedAt;
        }

        if (data.deliveredAt) {
            updateData.deliveredAt = data.deliveredAt;
        }

        const result = await this.purchaseModel.update({ id }, updateData);
        return result.affected > 0;
    }

    /**
     * 批量发货（管理员功能）
     */
    async batchShipping(data: BatchShippingDTO): Promise<{ success: number; failed: number; errors: string[] }> {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const id of data.ids) {
            try {
                const purchase = await this.purchaseModel.findOne({ where: { id } });

                if (!purchase) {
                    failed++;
                    errors.push(`订单ID ${id}: 订单不存在`);
                    continue;
                }

                // 只有待发货状态的订单才能发货
                if (purchase.shippingStatus !== ShippingStatus.PENDING) {
                    failed++;
                    errors.push(`订单ID ${id}: 只有待发货状态的订单才能发货，当前状态为 ${purchase.shippingStatus}`);
                    continue;
                }

                const updateData: any = {
                    shippingStatus: ShippingStatus.SHIPPED,
                    updatedAt: new Date(),
                    shippedAt: data.shippedAt || new Date()
                };

                if (data.trackingNumber) {
                    updateData.trackingNumber = data.trackingNumber;
                }

                const result = await this.purchaseModel.update({ id }, updateData);

                if (result.affected > 0) {
                    success++;
                } else {
                    failed++;
                    errors.push(`订单ID ${id}: 更新失败`);
                }
            } catch (error) {
                failed++;
                errors.push(`订单ID ${id}: ${error.message}`);
            }
        }

        return { success, failed, errors };
    }

    /**
     * 取消订单（用户功能）
     */
    async cancelPurchase(id: number, userId: number): Promise<boolean> {
        const purchase = await this.purchaseModel.findOne({
            where: { id, userId }
        });

        if (!purchase) {
            throw new Error('购买记录不存在或无权限操作');
        }

        // 只有待发货状态的订单才能取消
        if (purchase.shippingStatus !== ShippingStatus.PENDING) {
            throw new Error('只有待发货状态的订单才能取消');
        }

        const result = await this.purchaseModel.update(
            { id },
            {
                shippingStatus: ShippingStatus.CANCELLED,
                updatedAt: new Date()
            }
        );

        return result.affected > 0;
    }

    /**
     * 获取统计信息
     */
    async getPurchaseStats(userId: number) {
        const total = await this.purchaseModel.count({ where: { userId } });
        const pending = await this.purchaseModel.count({
            where: { userId, shippingStatus: ShippingStatus.PENDING }
        });
        const shipped = await this.purchaseModel.count({
            where: { userId, shippingStatus: ShippingStatus.SHIPPED }
        });
        const delivered = await this.purchaseModel.count({
            where: { userId, shippingStatus: ShippingStatus.DELIVERED }
        });
        const cancelled = await this.purchaseModel.count({
            where: { userId, shippingStatus: ShippingStatus.CANCELLED }
        });

        return {
            total,
            pending,
            shipped,
            delivered,
            cancelled
        };
    }

    /**
     * 删除购买记录
     */
    async deletePurchase(id: number, userId?: number): Promise<boolean> {
        // 查找订单
        const purchase = await this.purchaseModel.findOne({
            where: userId ? { id, userId } : { id }
        });

        if (!purchase) {
            throw new Error('购买记录不存在或无权限删除');
        }

        const result = await this.purchaseModel.delete({ id });
        return result.affected > 0;
    }

    /**
     * 批量删除购买记录（管理员功能）
     */
    async batchDeletePurchases(ids: number[]): Promise<{ success: number; failed: number }> {
        let success = 0;
        let failed = 0;

        for (const id of ids) {
            try {
                const purchase = await this.purchaseModel.findOne({ where: { id } });
                if (purchase) {
                    const result = await this.purchaseModel.delete({ id });
                    if (result.affected > 0) {
                        success++;
                    } else {
                        failed++;
                    }
                } else {
                    failed++;
                }
            } catch (error) {
                failed++;
            }
        }

        return { success, failed };
    }

    /**
     * 设置收货信息
     */
    async setShippingInfo(id: number, userId: number, data: SetShippingInfoDTO): Promise<boolean> {
        // 查找订单
        const purchase = await this.purchaseModel.findOne({
            where: { id, userId }
        });

        if (!purchase) {
            throw new Error('购买记录不存在或无权限操作');
        }

        // 只有待发货状态的订单才能设置收货信息
        if (purchase.shippingStatus !== ShippingStatus.PENDING) {
            throw new Error('只有待发货状态的订单才能设置收货信息');
        }

        const result = await this.purchaseModel.update(
            { id },
            {
                receiverName: data.receiverName,
                receiverPhone: data.receiverPhone,
                shippingAddress: data.shippingAddress,
                updatedAt: new Date()
            }
        );

        return result.affected > 0;
    }

    /**
     * 检查收货信息是否填写完整
     */
    async checkShippingInfoComplete(id: number, userId?: number): Promise<{ isComplete: boolean }> {
        // 查找订单
        const whereCondition = userId ? { id, userId } : { id };
        const purchase = await this.purchaseModel.findOne({
            where: whereCondition,
            select: ['receiverName', 'receiverPhone', 'shippingAddress']
        });

        if (!purchase) {
            throw new Error('购买记录不存在');
        }

        // 检查收货信息是否完整
        const isComplete = !!(purchase.receiverName && purchase.receiverPhone && purchase.shippingAddress);

        return { isComplete };
    }

    /**
     * 确认收货
     */
    async confirmDelivery(id: number, userId: number): Promise<boolean> {
        // 查找订单
        const purchase = await this.purchaseModel.findOne({
            where: { id, userId }
        });

        if (!purchase) {
            throw new Error('购买记录不存在或无权限操作');
        }

        // 只有已发货状态的订单才能确认收货
        if (purchase.shippingStatus !== ShippingStatus.SHIPPED) {
            throw new Error('只有已发货状态的订单才能确认收货');
        }

        const result = await this.purchaseModel.update(
            { id },
            {
                shippingStatus: ShippingStatus.DELIVERED,
                deliveredAt: new Date(),
                updatedAt: new Date()
            }
        );

        return result.affected > 0;
    }
} 