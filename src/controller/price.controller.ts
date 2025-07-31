import { Controller, Post, Body, Del, Param, Get, Put, Inject } from '@midwayjs/core';
import { PriceService } from '../service/price.service';
import { SetPriceDto, SetDiscountRateDto, UpdatePriceDto } from '../dto/price.dto';
import { ResponseResult } from '../common/response.common';

@Controller('/price')
export class PriceController {
    @Inject()
    priceService: PriceService;

    @Post('/set-price')
    async setPrice(@Body() setPriceDto: SetPriceDto) {
        const result = await this.priceService.setPrice(setPriceDto);
        return ResponseResult.success(result);
    }

    @Post('/set-discount')
    async setDiscountRate(@Body() setDiscountRateDto: SetDiscountRateDto) {
        const result = await this.priceService.setDiscountRate(setDiscountRateDto);
        return ResponseResult.success(result);
    }

    @Put('/:seriesId')
    async updatePrice(
        @Param('seriesId') seriesId: string,
        @Body() updatePriceDto: UpdatePriceDto
    ) {
        const result = await this.priceService.updatePrice(+seriesId, updatePriceDto);
        return ResponseResult.success(result);
    }

    @Get('/:seriesId')
    async getPrice(@Param('seriesId') seriesId: string) {
        const result = await this.priceService.getPrice(+seriesId);
        return ResponseResult.success(result);
    }

    @Get('/all')
    async getAllPrices() {
        const result = await this.priceService.getAllPrices();
        return ResponseResult.success(result);
    }

    @Del('/:seriesId')
    async deletePrice(@Param('seriesId') seriesId: string) {
        await this.priceService.deletePrice(+seriesId);
        return ResponseResult.success(null, '价格记录删除成功');
    }

    @Post('/batch-set-prices')
    async batchSetPrices(@Body() prices: SetPriceDto[]) {
        const result = await this.priceService.batchSetPrices(prices);
        return ResponseResult.success(result);
    }

    @Post('/batch-set-discounts')
    async batchSetDiscountRates(@Body() discountRates: SetDiscountRateDto[]) {
        const result = await this.priceService.batchSetDiscountRates(discountRates);
        return ResponseResult.success(result);
    }
}