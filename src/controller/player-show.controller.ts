import { Controller, Post, Get, Put, Del, Body, Param, Query, Inject, HttpCode } from '@midwayjs/core';
import { PlayerShowService } from '../service/player-show.service';
import {
    CreatePlayerShowDTO,
    UpdatePlayerShowDTO,
    QueryPlayerShowDTO,
    LikePlayerShowDTO
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
     * 获取玩家秀列表
     */
    @Get('/list', { description: '获取玩家秀列表' })
    @HttpCode(200)
    public async getPlayerShows(@Query() query: QueryPlayerShowDTO) {
        try {
            const result = await this.playerShowService.getPlayerShows(query);
            return ResponseResult.success(result, '获取玩家秀列表成功');
        } catch (error) {
            return ResponseResult.error(error.message || '获取玩家秀列表失败', 500);
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
     * 更新玩家秀
     */
    @Put('/:id', { middleware: [JwtMiddleware], description: '更新玩家秀' })
    @HttpCode(200)
    public async updatePlayerShow(@Param('id') id: number, @Body() data: UpdatePlayerShowDTO) {
        try {
            const userId = this.ctx.user.userId;
            const playerShow = await this.playerShowService.updatePlayerShow(id, userId, data);
            return ResponseResult.success(playerShow, '玩家秀更新成功');
        } catch (error) {
            return ResponseResult.error(error.message || '更新玩家秀失败', 400);
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
     * 点赞/取消点赞玩家秀
     */
    @Post('/like', { middleware: [JwtMiddleware], description: '点赞/取消点赞玩家秀' })
    @HttpCode(200)
    public async likePlayerShow(@Body() data: LikePlayerShowDTO) {
        try {
            const playerShow = await this.playerShowService.likePlayerShow(data.playerShowId, data.isLike);
            return ResponseResult.success(playerShow, data.isLike ? '点赞成功' : '取消点赞成功');
        } catch (error) {
            return ResponseResult.error(error.message || '操作失败', 400);
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
            query.userId = userId;
            const result = await this.playerShowService.getPlayerShows(query);
            return ResponseResult.success(result, '获取我的玩家秀列表成功');
        } catch (error) {
            return ResponseResult.error(error.message || '获取我的玩家秀列表失败', 500);
        }
    }



    /**
     * 置顶/取消置顶玩家秀（管理员接口）
     */
    @Post('/admin/:id/pin', { middleware: [JwtMiddleware], description: '置顶/取消置顶玩家秀' })
    @HttpCode(200)
    public async pinPlayerShow(@Param('id') id: number, @Body() data: { isPinned: boolean }) {
        try {
            // 这里可以添加管理员权限验证
            const playerShow = await this.playerShowService.pinPlayerShow(id, data.isPinned);
            return ResponseResult.success(playerShow, data.isPinned ? '置顶成功' : '取消置顶成功');
        } catch (error) {
            return ResponseResult.error(error.message || '操作失败', 400);
        }
    }

    /**
     * 隐藏/显示玩家秀（管理员接口）
     */
    @Post('/admin/:id/hide', { middleware: [JwtMiddleware], description: '隐藏/显示玩家秀' })
    @HttpCode(200)
    public async hidePlayerShow(@Param('id') id: number, @Body() data: { isHidden: boolean }) {
        try {
            // 这里可以添加管理员权限验证
            const playerShow = await this.playerShowService.hidePlayerShow(id, data.isHidden);
            return ResponseResult.success(playerShow, data.isHidden ? '隐藏成功' : '显示成功');
        } catch (error) {
            return ResponseResult.error(error.message || '操作失败', 400);
        }
    }
} 