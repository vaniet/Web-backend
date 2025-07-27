// src/entity/style.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Series } from './series.entity';

@Entity()
export class Style {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Index() // 普通索引，加速按系列查找
    @Column()
    seriesId: number;

    @ManyToOne(() => Series, series => series.styles)
    series: Series;

    @Column({ default: false })
    isHidden: boolean;

    @Column({ length: 255, nullable: true })
    cover: string;

    @Column({ type: 'text', nullable: true })
    description: string;
}
