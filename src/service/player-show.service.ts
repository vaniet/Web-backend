import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import type { Repository } from 'typeorm';
import { PlayerShow } from '../entity/player-show.entity';
import { Purchase } from '../entity/purchase.entity';
import { Series } from '../entity/series.entity';
import { User } from '../entity/user.entity';
import { Comment } from '../entity/comment.entity';
import {
    CreatePlayerShowDTO,
    QueryPlayerShowDTO,
    PlayerShowListResponseDTO,
    PlayerShowDetailResponseDTO
} from '../dto/player-show.dto';
import {
    CreateCommentDTO,
    CommentListResponseDTO,
    CommentDetailResponseDTO,
    QueryCommentDTO
} from '../dto/comment.dto';
import { ShippingStatus } from '../entity/purchase.entity';

@Provide()
export class PlayerShowService {
    @InjectEntityModel(PlayerShow)
    playerShowModel: Repository<PlayerShow>;

    @InjectEntityModel(Purchase)
    purchaseModel: Repository<Purchase>;

    @InjectEntityModel(Series)
    seriesModel: Repository<Series>;

    @InjectEntityModel(User)
    userModel: Repository<User>;

    @InjectEntityModel(Comment)
    commentModel: Repository<Comment>;

    /**
     * 创建玩家秀
     * @param userId 用户ID
     * @param data 玩家秀数据
     * @returns 创建的玩家秀
     */
    async createPlayerShow(userId: number, data: CreatePlayerShowDTO): Promise<PlayerShow> {
        // 验证用户是否拥有该系列的已收货商品
        const hasDeliveredPurchase = await this.purchaseModel.findOne({
            where: {
                userId,
                seriesId: data.seriesId,
                shippingStatus: ShippingStatus.DELIVERED
            }
        });

        if (!hasDeliveredPurchase) {
            throw new Error('您需要拥有该系列的已收货商品才能发布玩家秀');
        }

        // 验证系列是否存在
        const series = await this.seriesModel.findOne({
            where: { id: data.seriesId }
        });

        if (!series) {
            throw new Error('系列不存在');
        }

        // 创建玩家秀
        const playerShow = this.playerShowModel.create({
            userId,
            seriesId: data.seriesId,
            title: data.title,
            content: data.content,
            images: JSON.stringify(data.images)
        });

        return await this.playerShowModel.save(playerShow);
    }

    /**
     * 获取所有玩家秀列表
     * @param query 查询条件
     * @returns 玩家秀列表和总数
     */
    async getAllPlayerShows(query: QueryPlayerShowDTO): Promise<{ list: PlayerShowListResponseDTO[], total: number }> {
        const queryBuilder = this.playerShowModel.createQueryBuilder('playerShow')
            .leftJoinAndSelect('playerShow.user', 'user')
            .where('playerShow.isHidden = :isHidden', { isHidden: false });

        // 添加查询条件
        if (query.seriesId) {
            queryBuilder.andWhere('playerShow.seriesId = :seriesId', { seriesId: query.seriesId });
        }

        // 排序
        const orderBy = query.orderBy || 'createdAt';
        const orderDirection = query.orderDirection || 'DESC';
        queryBuilder.orderBy(`playerShow.${orderBy}`, orderDirection);

        // 分页
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        queryBuilder.skip(offset).take(limit);

        const [list, total] = await queryBuilder.getManyAndCount();

        // 转换为响应DTO
        const responseList: PlayerShowListResponseDTO[] = list.map(item => {
            const images = JSON.parse(item.images);
            return {
                id: item.id,
                userId: item.userId,
                title: item.title,
                firstImage: images.length > 0 ? images[0] : '',
                createdAt: item.createdAt,
                user: item.user ? {
                    userId: item.user.userId,
                    username: item.user.username,
                    avatar: item.user.avatar
                } : undefined
            };
        });

        return { list: responseList, total };
    }

    /**
     * 获取我的玩家秀列表
     * @param userId 用户ID
     * @param query 查询条件
     * @returns 玩家秀列表和总数
     */
    async getMyPlayerShows(userId: number, query: QueryPlayerShowDTO): Promise<{ list: PlayerShowListResponseDTO[], total: number }> {
        const queryBuilder = this.playerShowModel.createQueryBuilder('playerShow')
            .leftJoinAndSelect('playerShow.user', 'user')
            .where('playerShow.userId = :userId', { userId })
            .andWhere('playerShow.isHidden = :isHidden', { isHidden: false });

        // 添加查询条件
        if (query.seriesId) {
            queryBuilder.andWhere('playerShow.seriesId = :seriesId', { seriesId: query.seriesId });
        }

        // 排序
        const orderBy = query.orderBy || 'createdAt';
        const orderDirection = query.orderDirection || 'DESC';
        queryBuilder.orderBy(`playerShow.${orderBy}`, orderDirection);

        // 分页
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        queryBuilder.skip(offset).take(limit);

        const [list, total] = await queryBuilder.getManyAndCount();

        // 转换为响应DTO
        const responseList: PlayerShowListResponseDTO[] = list.map(item => {
            const images = JSON.parse(item.images);
            return {
                id: item.id,
                userId: item.userId,
                title: item.title,
                firstImage: images.length > 0 ? images[0] : '',
                createdAt: item.createdAt,
                user: item.user ? {
                    userId: item.user.userId,
                    username: item.user.username,
                    avatar: item.user.avatar
                } : undefined
            };
        });

        return { list: responseList, total };
    }

    /**
     * 获取玩家秀详情
     * @param id 玩家秀ID
     * @returns 玩家秀详情
     */
    async getPlayerShowById(id: number): Promise<PlayerShowDetailResponseDTO | null> {
        const playerShow = await this.playerShowModel.findOne({
            where: { id },
            relations: ['user', 'series']
        });

        if (!playerShow) {
            return null;
        }

        return {
            id: playerShow.id,
            userId: playerShow.userId,
            seriesId: playerShow.seriesId,
            title: playerShow.title,
            content: playerShow.content,
            images: JSON.parse(playerShow.images),
            isPinned: playerShow.isPinned,
            isHidden: playerShow.isHidden,
            createdAt: playerShow.createdAt,
            user: playerShow.user ? {
                userId: playerShow.user.userId,
                username: playerShow.user.username,
                avatar: playerShow.user.avatar
            } : undefined,
            series: playerShow.series ? {
                id: playerShow.series.id,
                name: playerShow.series.name,
                cover: playerShow.series.cover
            } : undefined
        };
    }

    /**
     * 删除玩家秀
     * @param id 玩家秀ID
     * @param userId 用户ID
     * @returns 是否删除成功
     */
    async deletePlayerShow(id: number, userId: number): Promise<boolean> {
        const playerShow = await this.playerShowModel.findOne({
            where: { id, userId }
        });

        if (!playerShow) {
            throw new Error('玩家秀不存在或无权限删除');
        }

        await this.playerShowModel.remove(playerShow);
        return true;
    }

    /**
     * 创建评论
     * @param userId 用户ID
     * @param playerShowId 玩家秀ID
     * @param data 评论数据
     * @returns 创建的评论
     */
    async createComment(userId: number, playerShowId: number, data: CreateCommentDTO): Promise<CommentDetailResponseDTO> {
        // 验证玩家秀是否存在
        const playerShow = await this.playerShowModel.findOne({
            where: { id: playerShowId, isHidden: false }
        });

        if (!playerShow) {
            throw new Error('玩家秀不存在或已被隐藏');
        }

        // 创建评论
        const comment = this.commentModel.create({
            userId,
            playerShowId,
            content: data.content
        });

        const savedComment = await this.commentModel.save(comment);

        // 获取评论详情（包含用户信息）
        const commentWithUser = await this.commentModel.findOne({
            where: { id: savedComment.id },
            relations: ['user', 'playerShow']
        });

        if (!commentWithUser) {
            throw new Error('创建评论失败');
        }

        return {
            id: commentWithUser.id,
            content: commentWithUser.content,
            isHidden: commentWithUser.isHidden,
            createdAt: commentWithUser.createdAt,
            user: commentWithUser.user ? {
                userId: commentWithUser.user.userId,
                username: commentWithUser.user.username,
                avatar: commentWithUser.user.avatar
            } : undefined,
            playerShow: commentWithUser.playerShow ? {
                id: commentWithUser.playerShow.id,
                title: commentWithUser.playerShow.title
            } : undefined
        };
    }

    /**
     * 获取玩家秀的评论列表
     * @param playerShowId 玩家秀ID
     * @param query 查询条件
     * @returns 评论列表和总数
     */
    async getCommentsByPlayerShow(playerShowId: number, query: QueryCommentDTO): Promise<{ list: CommentListResponseDTO[], total: number }> {
        // 验证玩家秀是否存在
        const playerShow = await this.playerShowModel.findOne({
            where: { id: playerShowId, isHidden: false }
        });

        if (!playerShow) {
            throw new Error('玩家秀不存在或已被隐藏');
        }

        const queryBuilder = this.commentModel.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .where('comment.playerShowId = :playerShowId', { playerShowId })
            .andWhere('comment.isHidden = :isHidden', { isHidden: false });

        // 排序
        const orderBy = query.orderBy || 'createdAt';
        const orderDirection = query.orderDirection || 'ASC';
        queryBuilder.orderBy(`comment.${orderBy}`, orderDirection);

        // 分页
        const page = query.page || 1;
        const limit = query.limit || 20;
        const offset = (page - 1) * limit;

        queryBuilder.skip(offset).take(limit);

        const [list, total] = await queryBuilder.getManyAndCount();

        // 转换为响应DTO
        const responseList: CommentListResponseDTO[] = list.map(item => ({
            id: item.id,
            content: item.content,
            createdAt: item.createdAt,
            user: item.user ? {
                userId: item.user.userId,
                username: item.user.username,
                avatar: item.user.avatar
            } : undefined
        }));

        return { list: responseList, total };
    }

    /**
     * 删除评论
     * @param commentId 评论ID
     * @param userId 用户ID
     * @returns 是否删除成功
     */
    async deleteComment(commentId: number, userId: number): Promise<boolean> {
        const comment = await this.commentModel.findOne({
            where: { id: commentId, userId }
        });

        if (!comment) {
            throw new Error('评论不存在或无权限删除');
        }

        await this.commentModel.remove(comment);
        return true;
    }

    /**
     * 获取我的评论列表
     * @param userId 用户ID
     * @param query 查询条件
     * @returns 评论列表和总数
     */
    async getMyComments(userId: number, query: QueryCommentDTO): Promise<{ list: CommentDetailResponseDTO[], total: number }> {
        const queryBuilder = this.commentModel.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.playerShow', 'playerShow')
            .where('comment.userId = :userId', { userId })
            .andWhere('comment.isHidden = :isHidden', { isHidden: false });

        // 排序
        const orderBy = query.orderBy || 'createdAt';
        const orderDirection = query.orderDirection || 'DESC';
        queryBuilder.orderBy(`comment.${orderBy}`, orderDirection);

        // 分页
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        queryBuilder.skip(offset).take(limit);

        const [list, total] = await queryBuilder.getManyAndCount();

        // 转换为响应DTO
        const responseList: CommentDetailResponseDTO[] = list.map(item => ({
            id: item.id,
            content: item.content,
            isHidden: item.isHidden,
            createdAt: item.createdAt,
            user: item.user ? {
                userId: item.user.userId,
                username: item.user.username,
                avatar: item.user.avatar
            } : undefined,
            playerShow: item.playerShow ? {
                id: item.playerShow.id,
                title: item.playerShow.title
            } : undefined
        }));

        return { list: responseList, total };
    }
} 