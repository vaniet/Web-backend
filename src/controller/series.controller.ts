import { Controller, Post, Body, Del, Param, Get } from '@midwayjs/core';
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
} 