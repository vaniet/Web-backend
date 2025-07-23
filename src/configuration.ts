import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typeorm from '@midwayjs/typeorm';
import { join } from 'path';
import * as view from '@midwayjs/view-nunjucks';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import { type } from 'os';

@Configuration({
  imports: [
    koa,
    validate,
    view,
    typeorm,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
