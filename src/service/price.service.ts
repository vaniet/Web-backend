import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import type { Repository } from 'typeorm';
import { Price } from '../entity/price.entity';
import { SetPriceDto, SetDiscountRateDto, UpdatePriceDto } from '../dto/price.dto';

@Provide()
export class PriceService {
    @InjectEntityModel(Price)
    priceModel: Repository<Price>;

    /**
     * 设置价格
     */
    async setPrice(setPriceDto: SetPriceDto): Promise<Price> {
        const { seriesId, price } = setPriceDto;

        // 查找现有价格记录
        let priceRecord = await this.priceModel.findOne({
            where: { seriesId }
        });

        if (priceRecord) {
            // 更新现有记录
            priceRecord.price = price;
            priceRecord.actualPrice = Number((price * priceRecord.discountRate).toFixed(2));
            priceRecord.updatedAt = new Date();
        } else {
            // 创建新记录
            priceRecord = this.priceModel.create({
                seriesId,
                price,
                discountRate: 1.00, // 默认折扣系数
                actualPrice: price,
            });
        }

        return await this.priceModel.save(priceRecord);
    }

    /**
     * 设置折扣系数
     */
    async setDiscountRate(setDiscountRateDto: SetDiscountRateDto): Promise<Price> {
        const { seriesId, discountRate } = setDiscountRateDto;

        // 查找现有价格记录
        let priceRecord = await this.priceModel.findOne({
            where: { seriesId }
        });

        if (priceRecord) {
            // 更新现有记录
            priceRecord.discountRate = discountRate;
            priceRecord.actualPrice = Number((priceRecord.price * discountRate).toFixed(2));
            priceRecord.updatedAt = new Date();
        } else {
            // 如果没有价格记录，先创建默认价格记录
            priceRecord = this.priceModel.create({
                seriesId,
                price: 0, // 默认价格
                discountRate,
                actualPrice: 0,
            });
        }

        return await this.priceModel.save(priceRecord);
    }

    /**
     * 更新价格信息
     */
    async updatePrice(seriesId: number, updatePriceDto: UpdatePriceDto): Promise<Price> {
                const priceRecord = await this.priceModel.findOne({
            where: { seriesId }
        });

        if (!priceRecord) {
            throw new Error(`系列ID ${seriesId} 的价格记录不存在`);
        }

        // 更新价格和折扣系数
        if (updatePriceDto.price !== undefined) {
            priceRecord.price = updatePriceDto.price;
        }
        
        if (updatePriceDto.discountRate !== undefined) {
            priceRecord.discountRate = updatePriceDto.discountRate;
        }

        // 重新计算实际价格
        priceRecord.actualPrice = Number((priceRecord.price * priceRecord.discountRate).toFixed(2));
        priceRecord.updatedAt = new Date();

        return await this.priceModel.save(priceRecord);
    }

    /**
     * 获取价格信息
     */
    async getPrice(seriesId: number): Promise<Price> {
        const priceRecord = await this.priceModel.findOne({
            where: { seriesId }
        });

        if (!priceRecord) {
            throw new Error(`系列ID ${seriesId} 的价格记录不存在`);
        }

        return priceRecord;
    }

    /**
     * 获取所有价格信息
     */
    async getAllPrices(): Promise<Price[]> {
        return await this.priceModel.find({
            order: { seriesId: 'ASC' }
        });
    }

    /**
     * 删除价格记录
     */
    async deletePrice(seriesId: number): Promise<void> {
        const priceRecord = await this.priceModel.findOne({
            where: { seriesId }
        });

        if (!priceRecord) {
            throw new Error(`系列ID ${seriesId} 的价格记录不存在`);
        }

        await this.priceModel.remove(priceRecord);
    }

    /**
     * 批量设置价格
     */
    async batchSetPrices(prices: SetPriceDto[]): Promise<Price[]> {
        const results: Price[] = [];

        for (const priceDto of prices) {
            const result = await this.setPrice(priceDto);
            results.push(result);
        }

        return results;
    }

    /**
     * 批量设置折扣系数
     */
    async batchSetDiscountRates(discountRates: SetDiscountRateDto[]): Promise<Price[]> {
        const results: Price[] = [];

        for (const discountDto of discountRates) {
            const result = await this.setDiscountRate(discountDto);
            results.push(result);
        }

        return results;
    }
}