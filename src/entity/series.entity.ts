import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Style } from './index';
import { Stock } from './stock.entity';
import { Purchase } from './purchase.entity';

@Entity()
export class Series {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'int' })
    styleCount: number;

    @Column({ length: 255, nullable: true })
    cover: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    detail: string;

    @OneToMany(() => Style, style => style.series)
    styles: Style[];

    @OneToMany(() => Stock, stock => stock.series)
    stocks: Stock[];

    // 购买记录关联
    @OneToMany(() => Purchase, purchase => purchase.series)
    purchases: Purchase[];
}
