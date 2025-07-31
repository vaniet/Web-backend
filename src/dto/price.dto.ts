

export class SetPriceDto {
    seriesId: number;
    price: number;
}

export class SetDiscountRateDto {
    seriesId: number;
    discountRate: number;
}

export class UpdatePriceDto {
    price?: number;
    discountRate?: number;
}