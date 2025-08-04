import { Catch, MidwayError, httpError, Context } from '@midwayjs/core';

interface ErrorResponse {
  code: number;
  message: string;
  data: null;
}

@Catch()
export class DefaultErrorFilter {
  async catch(err: MidwayError, ctx: Context) {
    // 获取错误信息，但不包含敏感的堆栈信息
    const errorInfo = {
      message: err.message || 'Internal Server Error',
      status: (err as any).status || 500,
      code: (err as any).code || 'INTERNAL_ERROR',
      url: (ctx as any).url,
      method: (ctx as any).method,
      timestamp: new Date().toISOString()
    };

    // 根据错误类型分类处理
    if (err instanceof httpError.BadRequestError) {
      errorInfo.status = 400;
      errorInfo.code = 'BAD_REQUEST';
    } else if (err instanceof httpError.UnauthorizedError) {
      errorInfo.status = 401;
      errorInfo.code = 'UNAUTHORIZED';
    } else if (err instanceof httpError.ForbiddenError) {
      errorInfo.status = 403;
      errorInfo.code = 'FORBIDDEN';
    } else if (err instanceof httpError.NotFoundError) {
      errorInfo.status = 404;
      errorInfo.code = 'NOT_FOUND';
    } else if (err instanceof httpError.ConflictError) {
      errorInfo.status = 409;
      errorInfo.code = 'CONFLICT';
    } else if (err instanceof httpError.UnprocessableEntityError) {
      errorInfo.status = 422;
      errorInfo.code = 'UNPROCESSABLE_ENTITY';
    } else if (err instanceof httpError.InternalServerErrorError) {
      errorInfo.status = 500;
      errorInfo.code = 'INTERNAL_SERVER_ERROR';
    }

    // 记录错误日志，但不包含敏感信息
    ctx.logger.error('Application error occurred', {
      ...errorInfo,
      // 只在开发环境记录详细错误信息
      stack: process.env.NODE_ENV === 'local' ? err.stack : undefined
    });

    // 返回给客户端的错误信息
    const response: ErrorResponse = {
      code: errorInfo.status,
      message: errorInfo.message,
      data: null
    };

    // 在生产环境中隐藏内部错误详情
    if (process.env.NODE_ENV === 'production' && errorInfo.status >= 500) {
      response.message = 'Internal Server Error';
    }

    return response;
  }
}
