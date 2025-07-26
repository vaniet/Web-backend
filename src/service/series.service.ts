import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import type { Repository } from 'typeorm';
import { Series } from '../entity/series.entity';
import { Style } from '../entity/style.entity';
import { Stock } from '../entity/stock.entity';
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
      relations: ['styles', 'styles.stock']
    });

    if (!series) return false;

    // 删除系列封面图片
    if (series.cover) {
      const seriesCoverPath = join(process.cwd(), 'public', series.cover);
      if (existsSync(seriesCoverPath)) {
        try { unlinkSync(seriesCoverPath); } catch { }
      }
    }

    // 删除款式图片和库存
    if (series.styles && series.styles.length > 0) {
      for (const style of series.styles) {
        // 删除款式封面图片
        if (style.cover) {
          const styleCoverPath = join(process.cwd(), 'public', style.cover);
          if (existsSync(styleCoverPath)) {
            try { unlinkSync(styleCoverPath); } catch { }
          }
        }
        // 删除库存记录
        if (style.stock) {
          await this.stockModel.delete({ styleId: style.id });
        }
      }
      // 删除款式记录
      await this.styleModel.delete({ seriesId });
    }

    // 删除系列记录
    await this.seriesModel.delete({ id: seriesId });
    return true;
  }
} 