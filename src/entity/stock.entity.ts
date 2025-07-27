// src/entity/stock.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Series } from './series.entity';

@Entity()
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seriesId: number;

    @ManyToOne(() => Series, series => series.stocks)
    @JoinColumn({ name: 'seriesId' })
    series: Series;

    @Column({ type: 'text' })
    boxContents: string; // 存储为JSON字符串

    @Column({ type: 'text', nullable: true })
    soldItems: string; // 存储为JSON字符串

    @Column({ type: 'boolean', default: false })
    isSoldOut: boolean; // 是否售罄

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
