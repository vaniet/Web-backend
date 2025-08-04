import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();

      try {
        const result = await next();
        const responseTime = Date.now() - startTime;

        // 只记录关键信息，省略敏感数据
        const logInfo = {
          method: ctx.method,
          url: ctx.url,
          status: ctx.status,
          responseTime: `${responseTime}ms`,
          userAgent: ctx.get('User-Agent')?.substring(0, 50) || 'Unknown'
        };

        // 根据响应时间分类日志级别
        if (responseTime > 1000) {
          ctx.logger.warn('Slow request detected', logInfo);
        } else if (responseTime > 500) {
          ctx.logger.info('Request completed', logInfo);
        } else {
          ctx.logger.debug('Request completed', logInfo);
        }

        return result;
      } catch (error) {
        const responseTime = Date.now() - startTime;

        // 错误日志，省略敏感信息
        const errorInfo = {
          method: ctx.method,
          url: ctx.url,
          status: ctx.status || 500,
          responseTime: `${responseTime}ms`,
          error: error.message || 'Unknown error',
          errorType: error.constructor.name
        };

        // 过滤掉SQL错误中的敏感查询信息
        if (error.message?.includes('SQLITE_ERROR')) {
          errorInfo.error = 'Database query error';
          errorInfo.errorType = 'DatabaseError';
        }

        ctx.logger.error('Request failed', errorInfo);
        throw error;
      }
    };
  }

  static getName(): string {
    return 'report';
  }
}
