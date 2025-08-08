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

    // 新增：仅返回上架系列
    @Get('/listed')
    async getListedSeries() {
        const list = await this.seriesService.seriesModel.find({ where: { isListed: true } });
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

    // 方式一：/series/:id/listed
    @Put('/:id/listed')
    async updateSeriesListedA(@Param('id') id: number, @Body() body: any) {
        let nextListed: boolean | undefined;
        const raw = body?.isListed;
        if (typeof raw === 'boolean') {
            nextListed = raw;
        } else if (typeof raw === 'string') {
            if (raw.toLowerCase() === 'true') nextListed = true;
            if (raw.toLowerCase() === 'false') nextListed = false;
        } else if (typeof raw === 'number') {
            if (raw === 1) nextListed = true;
            if (raw === 0) nextListed = false;
        }
        if (typeof nextListed !== 'boolean') {
            return ResponseResult.error('缺少或非法的 isListed 参数', 400);
        }
        const result = await this.seriesService.seriesModel.update(
            { id: Number(id) },
            { isListed: nextListed }
        );
        if (result.affected === 0) {
            return ResponseResult.error('系列不存在', 404);
        }
        return ResponseResult.success(null, nextListed ? '系列已上架' : '系列已下架');
    }

    // 方式二：/series/listed/:id
    @Put('/listed/:id')
    async updateSeriesListedB(@Param('id') id: number, @Body() body: any) {
        return this.updateSeriesListedA(id, body);
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