import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Series } from './series.entity';

@Entity('price')
export class Price {
    @PrimaryColumn({ type: 'int', name: 'series_id' })
    seriesId: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, comment: '价格' })
    price: number;

    @Column({
        type: 'decimal',
        precision: 3,
        scale: 2,
        default: 1.00,
        comment: '折扣系数，1.00表示无折扣'
    })
    discountRate: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: '实际价格（价格 * 折扣系数）'
    })
    actualPrice: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        name: 'updated_at'
    })
    updatedAt: Date;

    // 与Series的一对一关系
    @OneToOne(() => Series, series => series.price, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'series_id' })
    series: Series;
}