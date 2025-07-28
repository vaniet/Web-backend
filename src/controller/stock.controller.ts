import { Controller, Post, Body, Get, Del, Param } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { StockService } from '../service/stock.service';
import { CreateStockDTO } from '../dto/stock.dto';
import { ResponseResult } from '../common/response.common';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { Context } from '@midwayjs/koa';

@Controller('/stock')
export class StockController {
  @Inject()
  stockService: StockService;

  @Inject()
  ctx: Context;

  /**
   * 创建库存
   */
  @Post('/create')
  async createStock(@Body() dto: CreateStockDTO) {
    try {
      const stocks = await this.stockService.createStock(dto);
      return ResponseResult.success(stocks, '库存创建成功');
    } catch (error) {
      return ResponseResult.error(error.message);
    }
  }

  /**
   * 购买（从指定盒抽取）- 需要登录验证
   */
  @Post('/purchase/:boxId', { middleware: [JwtMiddleware] })
  async purchaseFromBox(@Param('boxId') boxId: number) {
    const userId = this.ctx.user.userId;
    const result = await this.stockService.purchaseFromBox(Number(boxId), userId);
    if (result.success) {
      return ResponseResult.success({ styleId: result.styleId }, '购买成功');
    }
    return ResponseResult.error('该盒已售罄或不存在');
  }

  /**
   * 获取系列的所有库存
   */
  @Get('/series/:seriesId')
  async getStocksBySeries(@Param('seriesId') seriesId: number) {
    const stocks = await this.stockService.getStocksBySeriesId(Number(seriesId));
    return ResponseResult.success(stocks);
  }

  /**
   * 删除库存
   */
  @Del('/:id')
  async deleteStock(@Param('id') id: number) {
    const result = await this.stockService.deleteStock(Number(id));
    return { success: result };
  }
} 