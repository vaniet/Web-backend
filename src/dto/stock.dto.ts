export class CreateStockDTO {
    seriesId: number;
    quantity: number; // 创建数量
}

export class PurchaseResult {
    styleId: number;
    success: boolean;
} 