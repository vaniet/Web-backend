import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm'; // 使用正确的导入
import type { Repository } from 'typeorm';
import { User } from '../entity/index';
import { CreateUserDTO, LoginDTO, UpdateUserDTO } from '../dto/index';
import * as bcrypt from 'bcryptjs';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { UserRole } from '../dto/index'

@Provide()
export class UserService {
    @InjectEntityModel(User) // 修改为正确的装饰器
    userModel: Repository<User>; // 变量名改为 userModel 更符合新 API
    /**
     * 创建新用户
     * @param userData 用户注册信息
     * @returns 创建成功的用户信息(不含密码)
     */
    async createUser(userData: CreateUserDTO): Promise<Omit<User, 'password'>> {
        console.log('createUser - 接收到的数据:', userData);

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
        newUser.role = userData.role || UserRole.CUSTOMER; // 添加role字段处理，默认为customer

        console.log('createUser - 设置的role:', newUser.role);

        // 保存到数据库
        const savedUser = await this.userModel.save(newUser);
        console.log('createUser - 保存后的用户:', savedUser);

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
    /**
     * 修改用户信息
     * @param userId 用户ID
     * @param updateData 要更新的用户信息
     * @returns 更新后的用户信息(不含密码)
     */
    async updateUser(userId: number, updateData: UpdateUserDTO): Promise<Omit<User, 'password'>> {
        // 查找用户
        const user = await this.userModel.findOne({
            where: { userId }
        });

        if (!user) {
            throw new Error('用户不存在');
        }

        // 如果要修改用户名，检查是否重名
        if (updateData.username && updateData.username !== user.username) {
            const existingUser = await this.userModel.findOne({
                where: { username: updateData.username }
            });

            if (existingUser) {
                throw new Error('用户名已存在，无法修改');
            }
        }

        // 如果要修改密码，进行加密处理
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        // 更新用户信息（不包含role字段，保护身份不可修改）
        const updateFields: Partial<User> = {};

        if (updateData.username !== undefined) {
            updateFields.username = updateData.username;
        }
        if (updateData.phone !== undefined) {
            updateFields.phone = updateData.phone;
        }
        if (updateData.avatar !== undefined) {
            updateFields.avatar = updateData.avatar;
        }
        if (updateData.password !== undefined) {
            updateFields.password = updateData.password;
        }

        // 执行更新
        await this.userModel.update({ userId }, updateFields);

        // 获取更新后的用户信息
        const updatedUser = await this.userModel.findOne({
            where: { userId }
        });

        if (!updatedUser) {
            throw new Error('更新用户信息失败');
        }

        // 移除密码字段后返回
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    /**
     * 根据ID删除用户及其头像文件
     */
    async deleteUserById(userId: number): Promise<boolean> {
        const user = await this.userModel.findOne({ where: { userId } });
        if (!user) return false;
        // 删除头像文件
        if (user.avatar) {
            const avatarPath = join(process.cwd(), 'public', user.avatar);
            if (existsSync(avatarPath)) {
                try { unlinkSync(avatarPath); } catch { }
            }
        }
        await this.userModel.delete({ userId });
        return true;
    }

}