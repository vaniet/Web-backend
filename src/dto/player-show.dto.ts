// 创建玩家秀DTO
export class CreatePlayerShowDTO {
    seriesId: number;
    title: string;
    content: string;
    images: string[]; // 图片URL数组
}



// 查询玩家秀DTO
export class QueryPlayerShowDTO {
    seriesId?: number;
    userId?: number;
    isPinned?: boolean;
    isHidden?: boolean;
    page?: number;
    limit?: number;
    orderBy?: 'createdAt';
    orderDirection?: 'ASC' | 'DESC';
}



// 玩家秀响应DTO
export class PlayerShowResponseDTO {
    id: number;
    userId: number;
    seriesId: number;
    title: string;
    content: string;
    images: string[];
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