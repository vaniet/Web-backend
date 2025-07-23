import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {  // 关键：使用 export 导出类
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    username: string;

}