import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Style } from './index';
import { Stock } from './stock.entity';
import { Purchase } from './purchase.entity';
import { PlayerShow } from './player-show.entity';
import { Price } from './price.entity';
import { Message } from './message.entity';

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

    // 新增：系列上架状态，默认上架
    @Column({ default: true })
    isListed: boolean;

    @OneToMany(() => Style, style => style.series)
    styles: Style[];

    @OneToMany(() => Stock, stock => stock.series)
    stocks: Stock[];

    // 购买记录关联
    @OneToMany(() => Purchase, purchase => purchase.series)
    purchases: Purchase[];

    // 玩家秀关联
    @OneToMany(() => PlayerShow, playerShow => playerShow.series)
    playerShows: PlayerShow[];

    // 价格关联
    @OneToOne(() => Price, price => price.series)
    price: Price;

    // 消息关联
    @OneToMany(() => Message, message => message.series)
    messages: Message[];
}
