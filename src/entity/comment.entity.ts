import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { PlayerShow } from './player-show.entity';

@Entity('comment')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    // 用户关联
    @Column()
    @Index()
    userId: number;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'userId' })
    user: User;

    // 玩家秀关联
    @Column()
    @Index()
    playerShowId: number;

    @ManyToOne(() => PlayerShow, playerShow => playerShow.comments)
    @JoinColumn({ name: 'playerShowId' })
    playerShow: PlayerShow;

    // 评论内容
    @Column({ type: 'text', nullable: false })
    content: string;

    // 是否隐藏
    @Column({ type: 'boolean', default: false })
    isHidden: boolean;

    // 发布时间
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
} 