import { MidwayConfig } from '@midwayjs/core';
import * as entity from '../entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1752301630955_2034',
  koa: {
    port: 7001,
  },
  view: {
    defaultViewEngine: 'nunjucks',
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: 'webdevapi.db',
        synchronize: true,
        logging: true,
        entities: [
          ...Object.values(entity)
        ],
      }
    }
  }
} as MidwayConfig;
