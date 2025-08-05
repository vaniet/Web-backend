import { Controller, Post, Body, Get, Del, Param, Inject, HttpCode } from '@midwayjs/core';
import { PlayerShowService } from '../service/player-show.service';
import { CreateCommentDTO, QueryCommentDTO } from '../dto/comment.dto';
import { ResponseResult } from '../common/index';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { Context } from '@midwayjs/koa';

@Controller('/comments')
export class CommentController {
    @Inject()
    playerShowService: PlayerShowService;

    @Inject()
    ctx: Context;

    /**
     * 创建评论
     * @param playerShowId 玩家秀ID
     * @param data 评论数据
     * @returns 创建的评论
     */
    @Post('/player-show/:playerShowId', { middleware: [JwtMiddleware], description: '创建评论' })
    @HttpCode(200)
    public async createComment(@Param('playerShowId') playerShowId: number, @Body() data: CreateCommentDTO) {
        try {
            // 从JWT payload中获取用户ID
            const payload = this.ctx.user;
            if (!payload || !payload.userId) {
                return ResponseResult.error('未登录或会话已过期', 401);
            }

            const comment = await this.playerShowService.createComment(payload.userId, Number(playerShowId), data);
            return ResponseResult.success(comment, '评论创建成功');
        } catch (error) {
            return ResponseResult.error(error.message || '创建评论失败', 500);
        }
    }

    /**
     * 获取玩家秀的评论列表
     * @param playerShowId 玩家秀ID
     * @param query 查询参数
     * @returns 评论列表
     */
    @Get('/player-show/:playerShowId', { description: '获取玩家秀评论列表' })
    @HttpCode(200)
    public async getCommentsByPlayerShow(@Param('playerShowId') playerShowId: number, @Body() query: QueryCommentDTO) {
        try {
            const result = await this.playerShowService.getCommentsByPlayerShow(Number(playerShowId), query);
            return ResponseResult.success(result, '获取评论列表成功');
        } catch (error) {
            return ResponseResult.error(error.message || '获取评论列表失败', 500);
        }
    }

    /**
     * 删除评论
     * @param commentId 评论ID
     * @returns 删除结果
     */
    @Del('/:commentId', { middleware: [JwtMiddleware], description: '删除评论' })
    @HttpCode(200)
    public async deleteComment(@Param('commentId') commentId: number) {
        try {
            // 从JWT payload中获取用户ID
            const payload = this.ctx.user;
            if (!payload || !payload.userId) {
                return ResponseResult.error('未登录或会话已过期', 401);
            }

            const result = await this.playerShowService.deleteComment(Number(commentId), payload.userId);
            return ResponseResult.success({ success: result }, '评论删除成功');
        } catch (error) {
            return ResponseResult.error(error.message || '删除评论失败', 500);
        }
    }

    /**
     * 获取我的评论列表
     * @param query 查询参数
     * @returns 我的评论列表
     */
    @Get('/my', { middleware: [JwtMiddleware], description: '获取我的评论列表' })
    @HttpCode(200)
    public async getMyComments(@Body() query: QueryCommentDTO) {
        try {
            // 从JWT payload中获取用户ID
            const payload = this.ctx.user;
            if (!payload || !payload.userId) {
                return ResponseResult.error('未登录或会话已过期', 401);
            }

            const result = await this.playerShowService.getMyComments(payload.userId, query);
            return ResponseResult.success(result, '获取我的评论列表成功');
        } catch (error) {
            return ResponseResult.error(error.message || '获取我的评论列表失败', 500);
        }
    }
} 