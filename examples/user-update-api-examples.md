# 用户信息更新 API 示例

## 概述

新增了用户信息更新功能，支持修改用户名、手机号、头像和密码，但保护用户身份（role）不可修改。

## API 端点

### 1. 更新当前用户信息

**PUT** `/users/update`

更新当前登录用户的信息。

**请求头**：
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**请求体**：
```json
{
  "username": "new_username",
  "phone": "13800138001",
  "avatar": "avatar/new_avatar.jpg",
  "password": "new_password"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "用户信息更新成功",
  "data": {
    "userId": 1,
    "username": "new_username",
    "phone": "13800138001",
    "avatar": "avatar/new_avatar.jpg",
    "role": "customer"
  }
}
```

### 2. 管理员更新指定用户信息

**PUT** `/users/update/{id}`

管理员更新指定用户的信息（需要管理员权限）。

**请求头**：
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**请求体**：
```json
{
  "username": "updated_username",
  "phone": "13900139001",
  "avatar": "avatar/updated_avatar.jpg",
  "password": "new_password"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "用户信息更新成功",
  "data": {
    "userId": 2,
    "username": "updated_username",
    "phone": "13900139001",
    "avatar": "avatar/updated_avatar.jpg",
    "role": "customer"
  }
}
```

## 功能特性

### 1. 用户名重名检查
- 修改用户名时会自动检查是否与其他用户重名
- 如果重名，返回错误信息

**错误响应示例**：
```json
{
  "code": 400,
  "message": "用户名已存在，无法修改",
  "data": null
}
```

### 2. 密码加密
- 修改密码时会自动进行加密处理
- 使用 bcrypt 进行安全加密

### 3. 身份保护
- 用户身份（role）字段不可修改
- 保护用户权限不被意外更改

### 4. 权限控制
- 普通用户只能修改自己的信息
- 管理员可以修改任何用户的信息
- 需要相应的权限验证

## 错误处理

### 常见错误码

| 错误码 | 说明 | 可能原因 |
|--------|------|----------|
| 400 | 用户名已存在 | 尝试修改为已存在的用户名 |
| 401 | 未登录或会话已过期 | JWT token 无效或过期 |
| 403 | 权限不足 | 非管理员尝试修改其他用户信息 |
| 404 | 用户不存在 | 指定的用户ID不存在 |
| 500 | 服务器内部错误 | 数据库操作失败等 |

### 错误响应格式
```json
{
  "code": 400,
  "message": "错误描述",
  "data": null
}
```

## 使用示例

### 1. 用户修改自己的信息

```javascript
// 更新用户名和手机号
const response = await fetch('/users/update', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'new_username',
    phone: '13800138001'
  })
});

const result = await response.json();
console.log(result);
```

### 2. 管理员修改用户信息

```javascript
// 管理员更新指定用户信息
const response = await fetch('/users/update/2', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + adminToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin_updated_user',
    phone: '13900139001'
  })
});

const result = await response.json();
console.log(result);
```

### 3. 修改密码

```javascript
// 修改密码
const response = await fetch('/users/update', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    password: 'new_secure_password'
  })
});

const result = await response.json();
console.log(result);
```

## 安全考虑

1. **身份保护**：用户身份（role）字段不可修改，防止权限提升
2. **密码加密**：所有密码修改都会进行安全加密
3. **权限验证**：管理员功能需要相应的权限验证
4. **重名检查**：防止用户名冲突
5. **JWT 验证**：所有更新操作都需要有效的 JWT token

## 注意事项

1. 修改用户名时需要确保新用户名不与其他用户重名
2. 密码修改后需要重新登录
3. 管理员功能需要管理员权限
4. 所有字段都是可选的，可以只修改需要的字段
5. 身份（role）字段不可修改，保护用户权限 