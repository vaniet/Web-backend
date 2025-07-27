import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import type { Repository } from 'typeorm';
import { Stock } from '../entity/stock.entity';
import { Series } from '../entity/series.entity';
import { Style } from '../entity/style.entity';
import { CreateStockDTO, PurchaseResult } from '../dto/stock.dto';

@Provide()
export class StockService {
  @InjectEntityModel(Stock)
  stockModel: Repository<Stock>;

  @InjectEntityModel(Series)
  seriesModel: Repository<Series>;

  @InjectEntityModel(Style)
  styleModel: Repository<Style>;

  /**
   * 创建库存（以盒为单位）
   */
  async createStock(data: CreateStockDTO): Promise<Stock[]> {
    const series = await this.seriesModel.findOne({
      where: { id: data.seriesId },
      relations: ['styles']
    });

    if (!series) {
      throw new Error('系列不存在');
    }

    const stocks: Stock[] = [];

    for (let i = 0; i < data.quantity; i++) {
      // 每盒独立生成内容
      const boxContents = this.generateBoxContents(series.styles);

      const stock = this.stockModel.create({
        seriesId: data.seriesId,
        boxContents: JSON.stringify(boxContents),
        soldItems: JSON.stringify([]),
        isSoldOut: false
      });

      stocks.push(await this.stockModel.save(stock));
    }

    return stocks;
  }

  /**
   * 生成单盒内容
   */
  private generateBoxContents(styles: Style[]): number[] {
    const normalStyles = styles.filter(style => !style.isHidden);
    const hiddenStyles = styles.filter(style => style.isHidden);

    if (normalStyles.length === 0) {
      throw new Error('系列中没有常规款式');
    }

    // 默认包含所有常规款
    let boxContents = normalStyles.map(style => style.id);

    // 每盒独立判断：5%概率包含隐藏款
    if (Math.random() < 0.05 && hiddenStyles.length > 0) {
      const randomHiddenStyle = hiddenStyles[Math.floor(Math.random() * hiddenStyles.length)];
      const randomNormalStyle = normalStyles[Math.floor(Math.random() * normalStyles.length)];

      // 替换一个常规款为隐藏款
      const index = boxContents.indexOf(randomNormalStyle.id);
      if (index !== -1) {
        boxContents[index] = randomHiddenStyle.id;
      }
    }

    return boxContents;
  }

  /**
   * 购买（从指定盒中抽取款式）
   */
  async purchaseFromBox(boxId: number): Promise<PurchaseResult> {
    const stock = await this.stockModel.findOne({ where: { id: boxId } });

    if (!stock || stock.isSoldOut) {
      return { styleId: null, success: false };
    }

    const boxContents = JSON.parse(stock.boxContents || '[]');
    const soldItems = JSON.parse(stock.soldItems || '[]');

    // 找出未售出的款式
    const availableStyles = boxContents.filter(
      styleId => !soldItems.includes(styleId)
    );

    if (availableStyles.length === 0) {
      // 标记为售罄
      await this.stockModel.update({ id: boxId }, { isSoldOut: true });
      return { styleId: null, success: false };
    }

    // 随机抽取一个款式
    const randomStyleId = availableStyles[Math.floor(Math.random() * availableStyles.length)];

    // 更新已售出列表
    const newSoldItems = [...soldItems, randomStyleId];
    await this.stockModel.update({ id: boxId }, { soldItems: JSON.stringify(newSoldItems) });

    return { styleId: randomStyleId, success: true };
  }

  /**
   * 获取系列的所有库存
   */
  async getStocksBySeriesId(seriesId: number): Promise<Stock[]> {
    return this.stockModel.find({
      where: { seriesId },
      relations: ['series']
    });
  }

  /**
   * 删除库存
   */
  async deleteStock(id: number): Promise<boolean> {
    const result = await this.stockModel.delete({ id });
    return result.affected > 0;
  }
} 