import { Controller, Post, Body, Inject, HttpCode, Del, Param } from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { CreateUserDTO, LoginDTO } from '../dto/index';
import { ResponseResult } from '../common/index';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { JwtMiddleware } from '../middleware/jwt.middleware';

@Controller('/users')
export class UserController {
    @Inject()
    userService: UserService;

    @Inject()
    jwtService: JwtService; // 注入JWT服务
    @Inject()
    ctx: Context; // 注入上下文对象

    @Post('/register', { description: '创建新用户' })
    @HttpCode(200)
    public async createUser(@Body() userData: CreateUserDTO) {
        try {
            const user = await this.userService.createUser(userData);
            return ResponseResult.success(user, '用户创建成功');
        } catch (error) {
            // 添加状态码处理
            return ResponseResult.error(
                error.message || '创建用户失败',
                error.message === '用户名已存在' ? 400 : 500
            );
        }
    }
    /**
     * 用户登录接口
     * @param loginData 登录信息（用户名和密码）
     * @returns 包含JWT令牌和用户信息的响应
     */
    @Post('/login', { description: '用户登录' })
    @HttpCode(200)
    public async login(@Body() loginData: LoginDTO) {
        try {
            // 调用服务层验证用户
            const user = await this.userService.loginUser(loginData);

            // 生成JWT令牌，包含用户ID和用户名
            const token = await this.jwtService.sign({
                userId: user.userId,
                username: user.username
            });
            this.ctx.session.user = user; // 将用户信息存入会话
            // 返回登录成功信息，包含令牌和用户信息
            return ResponseResult.success(
                {
                    user,
                    token
                },
                '登录成功'
            );
        } catch (error) {
            // 根据错误类型返回相应状态码
            const errorCode = error.message === '用户不存在' || error.message === '密码错误'
                ? 401
                : 500;

            return ResponseResult.error(
                error.message || '登录失败',
                errorCode
            );
        }
    }
    /**
     * 获取当前登录用户信息
     * @returns 当前用户信息
     */
    @Post('/currentuser', { middleware: [JwtMiddleware], description: '获取当前用户信息' })
    @HttpCode(200)
    public async getCurrentUser() {
        try {
            console.log('getCurrentUser - ctx.user:', this.ctx.user);
            console.log('getCurrentUser - ctx.session:', this.ctx.session);

            // 从JWT payload中获取用户信息，而不是session
            const payload = this.ctx.user;
            if (!payload || !payload.userId) {
                console.log('getCurrentUser - No payload or userId');
                return ResponseResult.error('未登录或会话已过期', 401);
            }

            //console.log('getCurrentUser - Payload userId:', payload.userId);

            // 根据userId从数据库获取最新用户信息
            const user = await this.userService.getUserById(payload.userId);
            if (!user) {
                console.log('getCurrentUser - User not found in database');
                return ResponseResult.error('用户不存在', 404);
            }

            //console.log('getCurrentUser - User found:', user);

            // 移除密码字段
            const { password, ...userWithoutPassword } = user;
            return ResponseResult.success(userWithoutPassword, '获取当前用户信息成功');
        } catch (error) {
            //console.log('getCurrentUser - Error:', error);
            return ResponseResult.error(error.message || '获取用户信息失败', 500);
        }
    }

    @Del('/delete/:id')
    async deleteUser(@Param('id') id: number) {
        const result = await this.userService.deleteUserById(Number(id));
        return { success: result };
    }

}
