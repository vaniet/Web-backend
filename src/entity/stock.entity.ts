// src/entity/stock.entity.ts
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Style } from './style.entity';

@Entity()
export class Stock {
    @PrimaryColumn() // 以款式id为主键
    styleId: number;

    @OneToOne(() => Style, style => style.stock)
    @JoinColumn({ name: 'styleId' })
    style: Style;

    @Column({ type: 'int', default: 0 })
    quantity: number;
}
