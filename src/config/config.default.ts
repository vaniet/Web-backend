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
  },
  jwt: {
    secret: 'secret-key', // 密钥（生产环境需更换为复杂密钥）
    expiresIn: '1d', // 令牌有效期（1天）
  }
} as MidwayConfig;
