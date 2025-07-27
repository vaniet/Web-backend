import { Controller, Post, Body, Del, Param, Get, Put } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { SeriesService } from '../service/series.service';
import { CreateSeriesDTO } from '../dto/series.dto';
import { Series } from '../entity/series.entity';
import { ResponseResult } from '../common/response.common';

@Controller('/series')
export class SeriesController {
    @Inject()
    seriesService: SeriesService;

    @Post('/create')
    async create(@Body() dto: CreateSeriesDTO): Promise<Series> {
        return this.seriesService.createSeries(dto);
    }

    @Del('/delete/:id')
    async deleteSeries(@Param('id') id: number) {
        const result = await this.seriesService.deleteSeriesById(Number(id));
        return { success: result };
    }

    @Del('/style/delete/:id')
    async deleteStyle(@Param('id') id: number) {
        const result = await this.seriesService.deleteStyleById(Number(id));
        return { success: result };
    }

    @Get('/all')
    async getAllSeries() {
        const list = await this.seriesService.seriesModel.find();
        return ResponseResult.success(list);
    }

    @Get('/allWithDetail')
    async getAllSeriesWithStyles() {
        const list = await this.seriesService.seriesModel.find({
            relations: ['styles']
        });
        return ResponseResult.success(list);
    }

    @Get('/:id')
    async getSeriesDetail(@Param('id') id: number) {
        const series = await this.seriesService.seriesModel.findOne({
            where: { id },
            relations: ['styles']
        });
        if (!series) {
            return ResponseResult.error('系列不存在', 404);
        }
        return ResponseResult.success(series);
    }

    @Put('/:id/description')
    async updateSeriesDescription(@Param('id') id: number, @Body() body: { description: string }) {
        const result = await this.seriesService.seriesModel.update(
            { id: Number(id) },
            { description: body.description }
        );
        if (result.affected === 0) {
            return ResponseResult.error('系列不存在', 404);
        }
        return ResponseResult.success(null, '描述更新成功');
    }

    @Put('/:id/detail')
    async updateSeriesDetail(@Param('id') id: number, @Body() body: { detail: string }) {
        const result = await this.seriesService.seriesModel.update(
            { id: Number(id) },
            { detail: body.detail }
        );
        if (result.affected === 0) {
            return ResponseResult.error('系列不存在', 404);
        }
        return ResponseResult.success(null, '细节更新成功');
    }

    @Put('/style/:id/description')
    async updateStyleDescription(@Param('id') id: number, @Body() body: { description: string }) {
        const result = await this.seriesService.styleModel.update(
            { id: Number(id) },
            { description: body.description }
        );
        if (result.affected === 0) {
            return ResponseResult.error('款式不存在', 404);
        }
        return ResponseResult.success(null, '款式描述更新成功');
    }
} 