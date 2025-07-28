import { Controller, Post, Body, Get, Put, Del, Param, Query } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { PurchaseService } from '../service/purchase.service';
import { CreatePurchaseDTO, UpdateShippingDTO, QueryPurchaseDTO } from '../dto/purchase.dto';
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
    @Put('/:id/shipping', { middleware: [JwtMiddleware] })
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
     * 删除购买记录
     */
    @Del('/:id', { middleware: [JwtMiddleware] })
    async deletePurchase(@Param('id') id: number) {
        try {
            const result = await this.purchaseService.deletePurchase(Number(id));
            return { success: result };
        } catch (error) {
            return ResponseResult.error(error.message);
        }
    }
} 