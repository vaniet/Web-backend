import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import type { Repository } from 'typeorm';
import { Series } from '../entity/series.entity';
import { Style } from '../entity/style.entity';
import { Stock } from '../entity/stock.entity';
import { Message } from '../entity/message.entity';
import { CreateSeriesDTO } from '../dto/series.dto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Provide()
export class SeriesService {
  @InjectEntityModel(Series)
  seriesModel: Repository<Series>;

  @InjectEntityModel(Style)
  styleModel: Repository<Style>;

  @InjectEntityModel(Stock)
  stockModel: Repository<Stock>;

  @InjectEntityModel(Message)
  messageModel: Repository<Message>;

  /**
   * 创建新系列及其款式
   */
  async createSeries(data: CreateSeriesDTO): Promise<Series> {
    // 创建系列实体
    const newSeries = this.seriesModel.create({
      name: data.name,
      styleCount: data.styles.length,
      cover: data.cover,
      description: data.description,
      detail: data.detail,
      isListed: true,
    });
    const savedSeries = await this.seriesModel.save(newSeries);

    // 创建款式实体
    const styles = data.styles.map(style => {
      return this.styleModel.create({
        name: style.name,
        isHidden: style.isHidden ?? false,
        cover: style.cover,
        description: style.description,
        seriesId: savedSeries.id,
        series: savedSeries,
      });
    });
    await this.styleModel.save(styles);

    // 创建消息记录，合并系列名、简介、细节和款式名称
    const styleNames = data.styles.map(style => style.name).join('');
    const baseContent = [
      data.name,
      data.description || '',
      data.detail || ''
    ].filter(Boolean).join('\n\n');

    const messageContent = styleNames ?
      `${baseContent}${styleNames}` :
      baseContent;

    const newMessage = this.messageModel.create({
      seriesId: savedSeries.id,
      content: messageContent,
    });
    await this.messageModel.save(newMessage);

    // 返回带 styles 的系列
    savedSeries.styles = styles;
    return savedSeries;
  }

  /**
   * 删除系列及其款式、库存和图片文件
   */
  async deleteSeriesById(seriesId: number): Promise<boolean> {
    const series = await this.seriesModel.findOne({
      where: { id: seriesId },
      relations: ['styles']
    });

    if (!series) return false;

    // 删除系列封面图片
    if (series.cover) {
      const seriesCoverPath = join(process.cwd(), 'public', series.cover);
      if (existsSync(seriesCoverPath)) {
        try { unlinkSync(seriesCoverPath); } catch { }
      }
    }

    // 删除款式图片
    if (series.styles && series.styles.length > 0) {
      for (const style of series.styles) {
        // 删除款式封面图片
        if (style.cover) {
          const styleCoverPath = join(process.cwd(), 'public', style.cover);
          if (existsSync(styleCoverPath)) {
            try { unlinkSync(styleCoverPath); } catch { }
          }
        }
      }
      // 删除款式记录
      await this.styleModel.delete({ seriesId });
    }

    // 删除消息记录
    await this.messageModel.delete({ seriesId });

    // 删除库存记录
    await this.stockModel.delete({ seriesId });

    // 删除系列记录
    await this.seriesModel.delete({ id: seriesId });
    return true;
  }

  /**
   * 删除款式并更新系列数量
   */
  async deleteStyleById(styleId: number): Promise<boolean> {
    const style = await this.styleModel.findOne({
      where: { id: styleId },
      relations: ['series']
    });

    if (!style) return false;

    // 删除款式封面图片
    if (style.cover) {
      const styleCoverPath = join(process.cwd(), 'public', style.cover);
      if (existsSync(styleCoverPath)) {
        try { unlinkSync(styleCoverPath); } catch { }
      }
    }

    // 删除款式记录
    await this.styleModel.delete({ id: styleId });

    // 更新系列的数量
    const remainingStyles = await this.styleModel.count({
      where: { seriesId: style.seriesId }
    });

    // 如果系列中所有款式都被删除，则删除系列
    if (remainingStyles === 0) {
      await this.deleteSeriesById(style.seriesId);
      return true;
    }

    // 否则只更新系列的数量
    await this.seriesModel.update(
      { id: style.seriesId },
      { styleCount: remainingStyles }
    );

    return true;
  }
} 