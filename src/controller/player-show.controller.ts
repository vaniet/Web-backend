import { Controller, Post, Get, Del, Body, Param, Query, Inject, HttpCode } from '@midwayjs/core';
import { PlayerShowService } from '../service/player-show.service';
import {
    CreatePlayerShowDTO,
    QueryPlayerShowDTO
} from '../dto/player-show.dto';
import { ResponseResult } from '../common/index';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { Context } from '@midwayjs/koa';

@Controller('/player-shows')
export class PlayerShowController {
    @Inject()
    playerShowService: PlayerShowService;

    @Inject()
    ctx: Context;

    /**
     * 创建玩家秀
     */
    @Post('/create', { middleware: [JwtMiddleware], description: '创建玩家秀' })
    @HttpCode(200)
    public async createPlayerShow(@Body() data: CreatePlayerShowDTO) {
        try {
            const userId = this.ctx.user.userId;
            const playerShow = await this.playerShowService.createPlayerShow(userId, data);
            return ResponseResult.success(playerShow, '玩家秀创建成功');
        } catch (error) {
            return ResponseResult.error(error.message || '创建玩家秀失败', 400);
        }
    }

    /**
     * 获取所有玩家秀列表
     */
    @Get('/list', { description: '获取所有玩家秀列表' })
    @HttpCode(200)
    public async getAllPlayerShows(@Query() query: QueryPlayerShowDTO) {
        try {
            const result = await this.playerShowService.getAllPlayerShows(query);
            return ResponseResult.success(result, '获取所有玩家秀列表成功');
        } catch (error) {
            return ResponseResult.error(error.message || '获取所有玩家秀列表失败', 500);
        }
    }

    /**
     * 获取玩家秀详情
     */
    @Get('/:id', { description: '获取玩家秀详情' })
    @HttpCode(200)
    public async getPlayerShowById(@Param('id') id: number) {
        try {
            const playerShow = await this.playerShowService.getPlayerShowById(id);
            if (!playerShow) {
                return ResponseResult.error('玩家秀不存在', 404);
            }
            return ResponseResult.success(playerShow, '获取玩家秀详情成功');
        } catch (error) {
            return ResponseResult.error(error.message || '获取玩家秀详情失败', 500);
        }
    }



    /**
     * 删除玩家秀
     */
    @Del('/:id', { middleware: [JwtMiddleware], description: '删除玩家秀' })
    @HttpCode(200)
    public async deletePlayerShow(@Param('id') id: number) {
        try {
            const userId = this.ctx.user.userId;
            await this.playerShowService.deletePlayerShow(id, userId);
            return ResponseResult.success(null, '玩家秀删除成功');
        } catch (error) {
            return ResponseResult.error(error.message || '删除玩家秀失败', 400);
        }
    }



    /**
     * 获取我的玩家秀列表
     */
    @Get('/my/list', { middleware: [JwtMiddleware], description: '获取我的玩家秀列表' })
    @HttpCode(200)
    public async getMyPlayerShows(@Query() query: QueryPlayerShowDTO) {
        try {
            const userId = this.ctx.user.userId;
            const result = await this.playerShowService.getMyPlayerShows(userId, query);
            return ResponseResult.success(result, '获取我的玩家秀列表成功');
        } catch (error) {
            return ResponseResult.error(error.message || '获取我的玩家秀列表失败', 500);
        }
    }




} 