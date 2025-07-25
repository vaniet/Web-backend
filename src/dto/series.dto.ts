export class CreateStyleDTO {
    name: string;
    isHidden?: boolean;
    cover?: string;
}

export class CreateSeriesDTO {
    name: string;
    cover?: string;
    styles: CreateStyleDTO[];
} 