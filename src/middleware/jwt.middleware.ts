import { Middleware, IMiddleware,Inject } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';

@Middleware()
export class JwtMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwtService: JwtService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 从 Header 获取 Token
      const token = ctx.get('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        ctx.status = 401;
        ctx.body = { message: 'Token 缺失' };
        return;
      }

      try {
        // 验证 Token
        const payload = await this.jwtService.verify(token);
        // 将用户信息挂载到上下文
        ctx.user = payload; 
        await next();
      } catch (e) {
        ctx.status = 401;
        ctx.body = { message: 'Token 无效或已过期' };
      }
    };
  }

  // 配置中间件忽略的路由（如登录接口）
  static match(ctx: Context): boolean {
    return !ctx.path.includes('/users/login');
  }

  getName(): string {
    return 'jwt';
  }
}