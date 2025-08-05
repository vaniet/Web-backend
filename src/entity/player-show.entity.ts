import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Series } from './series.entity';
import { Comment } from './comment.entity';

@Entity('player_show')
export class PlayerShow {
    @PrimaryGeneratedColumn()
    id: number;

    // 用户关联
    @Column()
    @Index()
    userId: number;

    @ManyToOne(() => User, user => user.playerShows)
    @JoinColumn({ name: 'userId' })
    user: User;

    // 系列关联
    @Column()
    @Index()
    seriesId: number;

    @ManyToOne(() => Series, series => series.playerShows)
    @JoinColumn({ name: 'seriesId' })
    series: Series;

    // 玩家秀标题
    @Column({ length: 200, nullable: false })
    title: string;

    // 玩家秀内容文字
    @Column({ type: 'text', nullable: false })
    content: string;

    // 图片URL列表，JSON格式存储
    @Column({ type: 'text', nullable: false })
    images: string; // JSON字符串，存储图片URL数组

    // 是否置顶
    @Column({ type: 'boolean', default: false })
    isPinned: boolean;

    // 是否隐藏
    @Column({ type: 'boolean', default: false })
    isHidden: boolean;

    // 发布时间
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    // 评论关联
    @OneToMany(() => Comment, comment => comment.playerShow)
    comments: Comment[];
} 