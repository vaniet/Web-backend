import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../dto/index'
import { Purchase } from './purchase.entity';
import { PlayerShow } from './player-show.entity';
import { Comment } from './comment.entity';

@Entity('user') // 对应数据库表名
export class User {
    //自增用户id，主键
    @PrimaryGeneratedColumn({
        name: 'user_id', // 数据库字段名
    })
    userId: number;

    //用户名，不可重复，必选项
    @Column({
        length: 50,
        unique: true, // 数据库唯一索引，确保用户名不重复
        nullable: false, // 非空约束
        comment: '用户名（唯一）'
    })
    username: string;
    @Column({
        type: 'varchar',
        enum: UserRole, // 关联到 UserRole 枚举
        nullable: false,
        default: UserRole.CUSTOMER, // 恢复默认值，确保数据库层面有值
    })
    role: UserRole; // 类型指定为 UserRole 枚举
    //手机号，必选项
    @Column({
        length: 20,
        nullable: false,
        comment: '用户手机号（必填）'
    })
    phone: string;

    @Column({
        length: 255,
        nullable: true,
        comment: '用户头像URL',
    })
    avatar?: string;

    // 存储加密后的密码
    @Column({
        length: 100,
        nullable: false,
        comment: '加密后的用户密码'
    })
    password: string;

    /**
     * 记录创建时间
     * 符合RESTful资源状态跟踪需求，自动记录资源创建时间
     */
    @CreateDateColumn({
        name: 'created_at',
        comment: '账号创建时间'
    })
    createdAt: Date;

    /**
     * 记录更新时间
     * 跟踪资源状态变更，自动更新为最后修改时间
     */
    @UpdateDateColumn({
        name: 'updated_at',
        comment: '账号信息最后更新时间'
    })
    updatedAt: Date;

    // 购买记录关联
    @OneToMany(() => Purchase, purchase => purchase.user)
    purchases: Purchase[];

    // 玩家秀关联
    @OneToMany(() => PlayerShow, playerShow => playerShow.user)
    playerShows: PlayerShow[];

    // 评论关联
    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];
}
