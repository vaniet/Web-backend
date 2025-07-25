import { Controller, Post, Body } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { SeriesService } from '../service/series.service';
import { CreateSeriesDTO } from '../dto/series.dto';
import { Series } from '../entity/series.entity';

@Controller('/series')
export class SeriesController {
    @Inject()
    seriesService: SeriesService;

    @Post('/create')
    async create(@Body() dto: CreateSeriesDTO): Promise<Series> {
        return this.seriesService.createSeries(dto);
    }
} 