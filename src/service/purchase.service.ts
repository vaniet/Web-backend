import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import type { Repository } from 'typeorm';
import { Purchase, ShippingStatus } from '../entity/purchase.entity';
import { CreatePurchaseDTO, UpdateShippingDTO, QueryPurchaseDTO } from '../dto/purchase.dto';

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
    async getUserPurchases(userId: number, query: QueryPurchaseDTO = {}): Promise<{ purchases: Purchase[]; total: number }> {
        const { page = 1, limit = 10, shippingStatus } = query;

        const queryBuilder = this.purchaseModel.createQueryBuilder('purchase')
            .where('purchase.userId = :userId', { userId })
            .orderBy('purchase.purchasedAt', 'DESC');

        if (shippingStatus) {
            queryBuilder.andWhere('purchase.shippingStatus = :shippingStatus', { shippingStatus });
        }

        const total = await queryBuilder.getCount();
        const purchases = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        return { purchases, total };
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

        return {
            total,
            pending,
            shipped,
            delivered
        };
    }

    /**
     * 删除购买记录
     */
    async deletePurchase(id: number): Promise<boolean> {
        const result = await this.purchaseModel.delete({ id });
        return result.affected > 0;
    }
} 