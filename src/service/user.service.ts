import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm'; // 使用正确的导入
import type { Repository } from 'typeorm';
import { User } from '../entity/index';
import { CreateUserDTO, LoginDTO } from '../dto/index';
import * as bcrypt from 'bcryptjs';
import { Context } from '@midwayjs/koa';
@Provide()
export class UserService {
    @InjectEntityModel(User) // 修改为正确的装饰器
    userModel: Repository<User>; // 变量名改为 userModel 更符合新 API
    @Inject()
    ctx: Context; // 注入上下文，获取当前用户
    /**
     * 创建新用户
     * @param userData 用户注册信息
     * @returns 创建成功的用户信息(不含密码)
     */
    async createUser(userData: CreateUserDTO): Promise<Omit<User, 'password'>> {
        // 检查用户名是否已存在
        const existingUser = await this.userModel.findOne({
            where: { username: userData.username }
        });

        if (existingUser) {
            throw new Error('用户名已存在');
        }

        // 密码加密处理
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // 创建用户实体
        const newUser = new User();
        newUser.username = userData.username;
        newUser.phone = userData.phone;
        newUser.password = hashedPassword;
        newUser.avatar = userData.avatar;

        // 保存到数据库
        const savedUser = await this.userModel.save(newUser);

        // 移除密码字段后返回
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }
    /**
     * 用户登录
     * @param loginData 登录信息
     * @returns 登录成功的用户信息(不含密码)
     */
    async loginUser(loginData: LoginDTO): Promise<Omit<User, 'password'>> {
        // 查找用户
        const user = await this.userModel.findOne({
            where: { username: loginData.username }
        });

        if (!user) {
            throw new Error('用户不存在');
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new Error('密码错误');
        }

        // 移除密码字段后返回
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    // 根据 ID 查询用户
    async getUserById(userId: number): Promise<User | null> {
        return this.userModel.findOne({
            where: { userId }
        });
    }
    

}