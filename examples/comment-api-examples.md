# 评论 API 示例

## 概述

评论功能允许用户对玩家秀进行评论，支持创建、查看和删除评论。

## API 端点

### 1. 创建评论

**POST** `/comments/player-show/{playerShowId}`

为指定的玩家秀创建评论。

**请求头**：
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**请求体**：
```json
{
  "content": "这个玩家秀很棒！"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "评论创建成功",
  "data": {
    "id": 1,
    "content": "这个玩家秀很棒！",
    "isHidden": false,
    "createdAt": "2025-08-04T10:30:00.000Z",
    "user": {
      "userId": 1,
      "username": "testuser",
      "avatar": "avatar/test.jpg"
    },
    "playerShow": {
      "id": 1,
      "title": "我的第一个玩家秀"
    }
  }
}
```

### 2. 获取玩家秀评论列表

**GET** `/comments/player-show/{playerShowId}`

获取指定玩家秀的评论列表。

**请求体**：
```json
{
  "page": 1,
  "limit": 20,
  "orderBy": "createdAt",
  "orderDirection": "ASC"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取评论列表成功",
  "data": {
    "list": [
      {
        "id": 1,
        "content": "这个玩家秀很棒！",
        "createdAt": "2025-08-04T10:30:00.000Z",
        "user": {
          "userId": 1,
          "username": "testuser",
          "avatar": "avatar/test.jpg"
        }
      },
      {
        "id": 2,
        "content": "我也很喜欢这个系列",
        "createdAt": "2025-08-04T11:00:00.000Z",
        "user": {
          "userId": 2,
          "username": "anotheruser",
          "avatar": "avatar/another.jpg"
        }
      }
    ],
    "total": 2
  }
}
```

### 3. 删除评论

**DELETE** `/comments/{commentId}`

删除指定的评论（只能删除自己的评论）。

**请求头**：
```
Authorization: Bearer <jwt_token>
```

**响应示例**：
```json
{
  "code": 200,
  "message": "评论删除成功",
  "data": {
    "success": true
  }
}
```

### 4. 获取我的评论列表

**GET** `/comments/my`

获取当前用户的所有评论。

**请求头**：
```
Authorization: Bearer <jwt_token>
```

**请求体**：
```json
{
  "page": 1,
  "limit": 10,
  "orderBy": "createdAt",
  "orderDirection": "DESC"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取我的评论列表成功",
  "data": {
    "list": [
      {
        "id": 1,
        "content": "这个玩家秀很棒！",
        "isHidden": false,
        "createdAt": "2025-08-04T10:30:00.000Z",
        "user": {
          "userId": 1,
          "username": "testuser",
          "avatar": "avatar/test.jpg"
        },
        "playerShow": {
          "id": 1,
          "title": "我的第一个玩家秀"
        }
      }
    ],
    "total": 1
  }
}
```

## 功能特性

### 1. 权限控制
- 只有登录用户才能创建评论
- 用户只能删除自己的评论
- 评论与玩家秀关联

### 2. 数据验证
- 验证玩家秀是否存在且未被隐藏
- 验证评论内容不为空
- 验证用户权限

### 3. 分页和排序
- 支持分页查询
- 支持按创建时间排序
- 默认按时间升序排列

### 4. 关联查询
- 评论包含用户信息
- 评论包含玩家秀信息
- 支持隐藏评论功能

## 错误处理

### 常见错误码

| 错误码 | 说明 | 可能原因 |
|--------|------|----------|
| 400 | 请求参数错误 | 评论内容为空 |
| 401 | 未登录或会话已过期 | JWT token 无效或过期 |
| 404 | 玩家秀不存在 | 指定的玩家秀ID不存在或已被隐藏 |
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

### 1. 创建评论

```javascript
// 创建评论
const response = await fetch('/comments/player-show/1', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: '这个玩家秀很棒！'
  })
});

const result = await response.json();
console.log(result);
```

### 2. 获取评论列表

```javascript
// 获取玩家秀的评论列表
const response = await fetch('/comments/player-show/1', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    page: 1,
    limit: 20,
    orderBy: 'createdAt',
    orderDirection: 'ASC'
  })
});

const result = await response.json();
console.log(result);
```

### 3. 删除评论

```javascript
// 删除评论
const response = await fetch('/comments/1', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

const result = await response.json();
console.log(result);
```

### 4. 获取我的评论

```javascript
// 获取我的评论列表
const response = await fetch('/comments/my', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    page: 1,
    limit: 10,
    orderBy: 'createdAt',
    orderDirection: 'DESC'
  })
});

const result = await response.json();
console.log(result);
```

## 数据库结构

### Comment 表
```sql
CREATE TABLE comment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  playerShowId INTEGER NOT NULL,
  content TEXT NOT NULL,
  isHidden BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(user_id),
  FOREIGN KEY (playerShowId) REFERENCES player_show(id)
);
```

## 注意事项

1. 评论只能对未被隐藏的玩家秀创建
2. 用户只能删除自己的评论
3. 评论按时间顺序排列，默认升序
4. 评论包含用户头像和用户名信息
5. 支持评论隐藏功能（管理员功能）
6. 评论与玩家秀是一对多关系 