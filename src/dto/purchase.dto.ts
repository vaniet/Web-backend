import { ShippingStatus } from '../entity/purchase.entity';

// 创建购买记录DTO
export class CreatePurchaseDTO {
    stockId: number;
    styleId: number;
    seriesId: number;
    seriesName: string;
    styleName: string;
    seriesCover?: string;
    styleCover?: string;
    isHidden: boolean;
    shippingAddress?: string;
    receiverPhone?: string;
    receiverName?: string;
}

// 更新物流状态DTO
export class UpdateShippingDTO {
    shippingStatus: ShippingStatus;
    trackingNumber?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
}

// 批量发货DTO
export class BatchShippingDTO {
    ids: number[];
    trackingNumber?: string;
    shippedAt?: Date;
}

// 查询购买记录DTO
export class QueryPurchaseDTO {
    userId?: number;
    seriesId?: number;
    styleId?: number;
    shippingStatus?: ShippingStatus;
    page?: number;
    limit?: number;
}

// 批量删除DTO
export class BatchDeleteDTO {
    ids: number[];
}

// 设置收货信息DTO
export class SetShippingInfoDTO {
    receiverName: string;
    receiverPhone: string;
    shippingAddress: string;
} 