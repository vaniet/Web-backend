import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Style } from './index';

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
}
