import { Controller, Post, Body, Get, Put, Del, Param, Query } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { PurchaseService } from '../service/purchase.service';
import { CreatePurchaseDTO, UpdateShippingDTO, QueryPurchaseDTO, BatchDeleteDTO, BatchShippingDTO, SetShippingInfoDTO } from '../dto/purchase.dto';
import { ResponseResult } from '../common/response.common';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { Context } from '@midwayjs/koa';

@Controller('/purchase')
export class PurchaseController {
    @Inject()
    purchaseService: PurchaseService;

    @Inject()
    ctx: Context;

    /**
     * 创建购买记录（购买盲盒时调用）
     */
    @Post('/create', { middleware: [JwtMiddleware] })
    async createPurchase(@Body() data: CreatePurchaseDTO) {
        try {
            // 从JWT中获取用户ID
            const userId = this.ctx.user.userId;
            const purchase = await this.purchaseService.createPurchase(userId, data);
            return ResponseResult.success(purchase, '购买记录创建成功');
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 获取用户的购买记录
     */
    @Get('/my-purchases', { middleware: [JwtMiddleware] })
    async getMyPurchases(@Query() query: QueryPurchaseDTO) {
        try {
            const userId = this.ctx.user.userId;
            const result = await this.purchaseService.getUserPurchases(userId, query);
            return ResponseResult.success(result);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 获取所有订单ID列表（管理员功能）
     */
    @Get('/all', { middleware: [JwtMiddleware] })
    async getAllPurchases(@Query() query: QueryPurchaseDTO) {
        try {
            const result = await this.purchaseService.getAllPurchases(query);
            return ResponseResult.success(result);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 获取购买记录详情
     */
    @Get('/:id', { middleware: [JwtMiddleware] })
    async getPurchaseDetail(@Param('id') id: number) {
        try {
            const purchase = await this.purchaseService.getPurchaseById(Number(id));
            if (!purchase) {
                return ResponseResult.error('购买记录不存在', 404);
            }
            return ResponseResult.success(purchase);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 更新物流状态（管理员功能）  
     */
    @Put('/shipping/:id', { middleware: [JwtMiddleware] })
    async updateShippingStatus(@Param('id') id: number, @Body() data: UpdateShippingDTO) {
        try {
            const result = await this.purchaseService.updateShippingStatus(Number(id), data);
            if (result) {
                return ResponseResult.success(null, '物流状态更新成功');
            }
            return ResponseResult.error('购买记录不存在', 404);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 获取购买统计信息
     */
    @Get('/stats/my', { middleware: [JwtMiddleware] })
    async getMyPurchaseStats() {
        try {
            const userId = this.ctx.user.userId;
            const stats = await this.purchaseService.getPurchaseStats(userId);
            return ResponseResult.success(stats);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 取消订单（用户功能）
     */
    @Put('/cancel/:id', { middleware: [JwtMiddleware] })
    async cancelPurchase(@Param('id') id: number) {
        try {
            const userId = this.ctx.user.userId;
            const result = await this.purchaseService.cancelPurchase(Number(id), userId);
            if (result) {
                return ResponseResult.success(null, '订单取消成功');
            }
            return ResponseResult.error('取消失败', 500);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 删除购买记录（只有取消状态的订单才能删除）
     */
    @Del('/:id', { middleware: [JwtMiddleware] })
    async deletePurchase(@Param('id') id: number) {
        try {
            const userId = this.ctx.user.userId;
            const result = await this.purchaseService.deletePurchase(Number(id), userId);
            if (result) {
                return ResponseResult.success(null, '购买记录删除成功');
            }
            return ResponseResult.error('删除失败', 500);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 批量发货（管理员功能）
     */
    @Put('/batch-shipping', { middleware: [JwtMiddleware] })
    async batchShipping(@Body() data: BatchShippingDTO) {
        try {
            // 这里可以添加管理员权限验证
            const result = await this.purchaseService.batchShipping(data);
            return ResponseResult.success(
                result,
                `批量发货完成：成功${result.success}个，失败${result.failed}个`
            );
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 批量删除购买记录（管理员功能）
     */
    @Del('/batch', { middleware: [JwtMiddleware] })
    async batchDeletePurchases(@Body() data: BatchDeleteDTO) {
        try {
            // 这里可以添加管理员权限验证
            const result = await this.purchaseService.batchDeletePurchases(data.ids);
            return ResponseResult.success(result, `批量删除完成：成功${result.success}个，失败${result.failed}个`);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 设置收货信息
     */
    @Put('/shipping-info/:id', { middleware: [JwtMiddleware] })
    async setShippingInfo(@Param('id') id: number, @Body() data: SetShippingInfoDTO) {
        try {
            const userId = this.ctx.user.userId;
            const result = await this.purchaseService.setShippingInfo(Number(id), userId, data);
            if (result) {
                return ResponseResult.success(null, '收货信息设置成功');
            }
            return ResponseResult.error('设置失败', 500);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 检查收货信息是否填写完整（允许任何用户访问）
     */
    @Get('/shipping-info/check/:id', { middleware: [JwtMiddleware] })
    async checkShippingInfoComplete(@Param('id') id: number) {
        try {
            // 移除用户身份检查，允许任何用户访问此接口
            const result = await this.purchaseService.checkShippingInfoComplete(Number(id), null);
            return ResponseResult.success(result, '操作成功');
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }

    /**
     * 确认收货
     */
    @Put('/confirm-delivery/:id', { middleware: [JwtMiddleware] })
    async confirmDelivery(@Param('id') id: number) {
        try {
            const userId = this.ctx.user.userId;
            const result = await this.purchaseService.confirmDelivery(Number(id), userId);
            if (result) {
                return ResponseResult.success(null, '确认收货成功');
            }
            return ResponseResult.error('确认收货失败', 500);
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }
} 