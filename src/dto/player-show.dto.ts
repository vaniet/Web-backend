// 创建玩家秀DTO
export class CreatePlayerShowDTO {
    seriesId: number;
    title: string;
    content: string;
    images: string[]; // 图片URL数组
}

// 更新玩家秀DTO
export class UpdatePlayerShowDTO {
    title?: string;
    content?: string;
    images?: string[]; // 图片URL数组
}

// 查询玩家秀DTO
export class QueryPlayerShowDTO {
    seriesId?: number;
    userId?: number;
    isPinned?: boolean;
    isHidden?: boolean;
    page?: number;
    limit?: number;
    orderBy?: 'createdAt' | 'likes' | 'comments';
    orderDirection?: 'ASC' | 'DESC';
}

// 点赞玩家秀DTO
export class LikePlayerShowDTO {
    playerShowId: number;
    isLike: boolean; // true为点赞，false为取消点赞
}

// 玩家秀响应DTO
export class PlayerShowResponseDTO {
    id: number;
    userId: number;
    seriesId: number;
    title: string;
    content: string;
    images: string[];
    likes: number;
    comments: number;
    isPinned: boolean;
    isHidden: boolean;
    createdAt: Date;

    // 关联数据
    user?: {
        userId: number;
        username: string;
        avatar?: string;
    };

    series?: {
        id: number;
        name: string;
        cover?: string;
    };
} 