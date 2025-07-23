import { Controller, Post, Body, Context, Inject, HttpCode } from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { CreateUserDTO, LoginDTO } from '../dto/index';
import { ResponseResult } from '../common/index';
import { JwtService } from '@midwayjs/jwt';
//import { Headers } from '@midwayjs/core';

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
    
}
