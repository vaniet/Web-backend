import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typeorm from '@midwayjs/typeorm';
import { join } from 'path';
import * as view from '@midwayjs/view-nunjucks';
import * as jwt from '@midwayjs/jwt';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import * as upload from '@midwayjs/upload';
import * as cors from '@koa/cors';
import * as koaStatic from 'koa-static';
import * as DefaultConfig from './config/config.default';
import * as UnittestConfig from './config/config.unittest';


@Configuration({
  imports: [
    koa,
    validate,
    view,
    typeorm,
    jwt,
    upload,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [
    {
      default: DefaultConfig,  
      unittest: UnittestConfig,     
    }
  ],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady(container, app) {
    // 允许所有来源跨域（开发环境）
    app.use(cors({
      origin: 'http://localhost:5173', // 只允许前端开发端口
      credentials: true, // 如果需要携带cookie
    }));
    // 配置静态资源服务
    app.use(koaStatic(join(process.cwd(), 'public')));
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
