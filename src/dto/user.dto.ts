// 创建用户请求体
export class CreateUserDTO {
  username: string;
  phone: string;
  password: string;
  avatar?: string;
  role?: UserRole; // 添加role字段，可选
}
// 登录请求体
export class LoginDTO {
  username: string;
  password: string;
}

export enum UserRole {
  CUSTOMER = 'customer', // 普通用户
  MANAGER = 'manager'    // 管理员
}