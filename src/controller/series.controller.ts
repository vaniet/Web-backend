import { Controller, Post, Body, Del, Param } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { SeriesService } from '../service/series.service';
import { CreateSeriesDTO } from '../dto/series.dto';
import { Series } from '../entity/series.entity';
import { JwtMiddleware } from '../middleware/jwt.middleware';

@Controller('/series')
export class SeriesController {
    @Inject()
    seriesService: SeriesService;

    @Post('/create', { middleware: [JwtMiddleware], description: '创建系列' })
    async create(@Body() dto: CreateSeriesDTO): Promise<Series> {
        return this.seriesService.createSeries(dto);
    }

    @Del('/delete/:id')
    async deleteSeries(@Param('id') id: number) {
        const result = await this.seriesService.deleteSeriesById(Number(id));
        return { success: result };
    }
} 