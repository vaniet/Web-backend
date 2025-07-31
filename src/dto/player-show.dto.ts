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
    page?: number;
    limit?: number;
    orderBy?: 'createdAt';
    orderDirection?: 'ASC' | 'DESC';
}

// 玩家秀列表响应DTO
export class PlayerShowListResponseDTO {
    id: number;
    userId: number;
    title: string;
    firstImage: string; // 第一张图片
    createdAt: Date; // 创建日期
    
    // 关联数据
    user?: {
        userId: number;
        username: string;
        avatar?: string;
    };
}

// 玩家秀详情响应DTO
export class PlayerShowDetailResponseDTO {
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