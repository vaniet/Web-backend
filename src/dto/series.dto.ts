export class CreateStyleDTO {
    name: string;
    isHidden?: boolean;
    cover?: string;
    description?: string;
}

export class CreateSeriesDTO {
    name: string;
    cover?: string;
    description?: string;
    detail?: string;
    styles: CreateStyleDTO[];
} 