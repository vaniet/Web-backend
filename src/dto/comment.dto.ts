// 创建评论请求体
export class CreateCommentDTO {
    content: string;
}

// 评论列表响应DTO
export class CommentListResponseDTO {
    id: number;
    content: string;
    createdAt: Date;
    user: {
        userId: number;
        username: string;
        avatar?: string;
    };
}

// 评论详情响应DTO
export class CommentDetailResponseDTO {
    id: number;
    content: string;
    isHidden: boolean;
    createdAt: Date;
    user: {
        userId: number;
        username: string;
        avatar?: string;
    };
    playerShow: {
        id: number;
        title: string;
    };
}

// 查询评论DTO
export class QueryCommentDTO {
    page?: number;
    limit?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
} 