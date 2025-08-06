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
        logging: false, // 关闭SQL日志，减少冗余
        entities: [
          ...Object.values(entity)
        ],
      }
    }
  },
  jwt: {
    secret: 'secret-key', // 密钥（生产环境需更换为复杂密钥）
    expiresIn: '1d', // 令牌有效期（1天）
  },
  multipart: {
    mode: 'file',
    fileSize: '5mb',
    whitelist: ['.png', '.jpg', '.jpeg', '.gif'],
  },
  // 日志配置优化
  logger: {
    level: 'info',
    consoleLevel: 'info',
    // 自定义日志格式，省略敏感信息
    format: (info: any) => {
      const { timestamp, level, message, ...rest } = info;
      // 过滤掉敏感信息
      const filteredRest = { ...rest };
      delete filteredRest.headers;
      delete filteredRest.query;
      delete filteredRest.parameters;

      return {
        timestamp,
        level,
        message,
        ...filteredRest
      };
    }
  },
staticFile:{
dirs:{
  default:{
    prefix: '/',
    dir: 'public',
  },
  another:{
    prefix: '/assets',
    dir: 'public/assets',
  }
}
}
} as MidwayConfig;
