import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Series } from './series.entity';
import { Style } from './style.entity';

// 物流状态枚举
export enum ShippingStatus {
    PENDING = 'pending',      // 待发货
    SHIPPED = 'shipped',      // 已发货
    DELIVERED = 'delivered',  // 已收货
    CANCELLED = 'cancelled'   // 已取消
}

@Entity('purchase')
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    // 用户关联
    @Column()
    @Index()
    userId: number;

    @ManyToOne(() => User, user => user.purchases)
    @JoinColumn({ name: 'userId' })
    user: User;

    // 系列关联
    @Column()
    @Index()
    seriesId: number;

    @ManyToOne(() => Series, series => series.purchases)
    @JoinColumn({ name: 'seriesId' })
    series: Series;

    // 款式关联
    @Column()
    @Index()
    styleId: number;

    @ManyToOne(() => Style, style => style.purchases)
    @JoinColumn({ name: 'styleId' })
    style: Style;

    // 库存盒关联（记录从哪个盒购买的）
    @Column()
    @Index()
    stockId: number;

    // 商品信息（冗余存储，避免关联查询）
    @Column({ length: 100 })
    seriesName: string;

    @Column({ length: 100 })
    styleName: string;

    @Column({ length: 255, nullable: true })
    seriesCover: string;

    @Column({ length: 255, nullable: true })
    styleCover: string;

    @Column({ default: false })
    isHidden: boolean;

    // 物流信息
    @Column({
        type: 'varchar',
        enum: ShippingStatus,
        default: ShippingStatus.PENDING
    })
    @Index()
    shippingStatus: ShippingStatus;

    @Column({ type: 'datetime', nullable: true })
    shippedAt: Date; // 发货时间

    @Column({ type: 'datetime', nullable: true })
    deliveredAt: Date; // 收货时间

    @Column({ length: 100, nullable: true })
    trackingNumber: string; // 快递单号

    @Column({ length: 500, nullable: true })
    shippingAddress: string; // 收货地址

    @Column({ length: 20, nullable: true })
    receiverPhone: string; // 收货人电话

    @Column({ length: 50, nullable: true })
    receiverName: string; // 收货人姓名

    // 时间戳
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    @Index()
    purchasedAt: Date; // 购买时间

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
} 