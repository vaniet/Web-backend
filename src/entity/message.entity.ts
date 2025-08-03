import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Series } from './series.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    seriesId: number;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => Series, series => series.messages)
    @JoinColumn({ name: 'seriesId' })
    series: Series;
} 