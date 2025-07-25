import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import type { Repository } from 'typeorm';
import { Series } from '../entity/series.entity';
import { Style } from '../entity/style.entity';
import { CreateSeriesDTO } from '../dto/series.dto';

@Provide()
export class SeriesService {
  @InjectEntityModel(Series)
  seriesModel: Repository<Series>;

  @InjectEntityModel(Style)
  styleModel: Repository<Style>;

  /**
   * 创建新系列及其款式
   */
  async createSeries(data: CreateSeriesDTO): Promise<Series> {
    // 创建系列实体
    const newSeries = this.seriesModel.create({
      name: data.name,
      styleCount: data.styles.length,
      cover: data.cover,
    });
    const savedSeries = await this.seriesModel.save(newSeries);

    // 创建款式实体
    const styles = data.styles.map(style => {
      return this.styleModel.create({
        name: style.name,
        isHidden: style.isHidden ?? false,
        cover: style.cover,
        seriesId: savedSeries.id,
        series: savedSeries,
      });
    });
    await this.styleModel.save(styles);

    // 返回带 styles 的系列
    savedSeries.styles = styles;
    return savedSeries;
  }
} 