# 玩家秀 API 使用示例

## 1. 创建玩家秀

### 请求示例
```bash
curl -X POST http://localhost:7001/player-shows/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "seriesId": 1,
    "title": "我的第一个玩家秀",
    "content": "这是我购买的盲盒，非常喜欢！",
    "images": ["player-show/test1.jpg", "player-show/test2.jpg"]
  }'
```

### 响应示例
```json
{
  "code": 200,
  "message": "玩家秀创建成功，等待审核",
  "data": {
    "id": 1,
    "userId": 1,
    "seriesId": 1,
    "title": "我的第一个玩家秀",
    "content": "这是我购买的盲盒，非常喜欢！",
    "images": "[\"player-show/test1.jpg\",\"player-show/test2.jpg\"]",
    "likes": 0,
    "comments": 0,
    "isPinned": false,
    "isHidden": false,
    "status": "pending",
    "reviewNote": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": 1704067200000
}
```

## 2. 获取玩家秀列表

### 请求示例
```bash
curl -X GET "http://localhost:7001/player-shows/list?page=1&limit=10&seriesId=1&orderBy=createdAt&orderDirection=DESC"
```

### 响应示例
```json
{
  "code": 200,
  "message": "获取玩家秀列表成功",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1,
        "seriesId": 1,
        "title": "我的第一个玩家秀",
        "content": "这是我购买的盲盒，非常喜欢！",
        "images": ["player-show/test1.jpg", "player-show/test2.jpg"],
        "likes": 5,
        "comments": 2,
        "isPinned": false,
        "isHidden": false,
        "status": "approved",
        "reviewNote": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "userId": 1,
          "username": "testuser",
          "avatar": "avatar/test.jpg"
        },
        "series": {
          "id": 1,
          "name": "经典系列",
          "cover": "series/classic.jpg"
        }
      }
    ],
    "total": 1
  },
  "timestamp": 1704067200000
}
```

## 3. 获取玩家秀详情

### 请求示例
```bash
curl -X GET http://localhost:7001/player-shows/1
```

### 响应示例
```json
{
  "code": 200,
  "message": "获取玩家秀详情成功",
  "data": {
    "id": 1,
    "userId": 1,
    "seriesId": 1,
    "title": "我的第一个玩家秀",
    "content": "这是我购买的盲盒，非常喜欢！",
    "images": ["player-show/test1.jpg", "player-show/test2.jpg"],
    "likes": 5,
    "comments": 2,
    "isPinned": false,
    "isHidden": false,
    "status": "approved",
    "reviewNote": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "userId": 1,
      "username": "testuser",
      "avatar": "avatar/test.jpg"
    },
    "series": {
      "id": 1,
      "name": "经典系列",
      "cover": "series/classic.jpg"
    }
  },
  "timestamp": 1704067200000
}
```

## 4. 更新玩家秀

### 请求示例
```bash
curl -X PUT http://localhost:7001/player-shows/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "更新后的标题",
    "content": "更新后的内容",
    "images": ["player-show/updated1.jpg", "player-show/updated2.jpg"]
  }'
```

## 5. 点赞玩家秀

### 请求示例
```bash
curl -X POST http://localhost:7001/player-shows/like \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "playerShowId": 1,
    "isLike": true
  }'
```

## 6. 获取我的玩家秀

### 请求示例
```bash
curl -X GET "http://localhost:7001/player-shows/my/list?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 7. 管理员接口

### 获取待审核列表
```bash
curl -X GET "http://localhost:7001/player-shows/admin/pending?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 审核玩家秀
```bash
curl -X POST http://localhost:7001/player-shows/admin/1/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "status": "approved",
    "reviewNote": "内容符合规范，通过审核"
  }'
```

### 置顶玩家秀
```bash
curl -X POST http://localhost:7001/player-shows/admin/1/pin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "isPinned": true
  }'
```

## 错误响应示例

### 权限不足
```json
{
  "code": 401,
  "message": "Token 缺失",
  "timestamp": 1704067200000
}
```

### 验证失败
```json
{
  "code": 400,
  "message": "您需要拥有该系列的已收货商品才能发布玩家秀",
  "timestamp": 1704067200000
}
```

### 资源不存在
```json
{
  "code": 404,
  "message": "玩家秀不存在",
  "timestamp": 1704067200000
}
```

## JavaScript/TypeScript 使用示例

```typescript
// 创建玩家秀
async function createPlayerShow(token: string, data: any) {
  const response = await fetch('http://localhost:7001/player-shows/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
}

// 获取玩家秀列表
async function getPlayerShows(params: any = {}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`http://localhost:7001/player-shows/list?${queryString}`);
  
  return await response.json();
}

// 点赞玩家秀
async function likePlayerShow(token: string, playerShowId: number, isLike: boolean) {
  const response = await fetch('http://localhost:7001/player-shows/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      playerShowId,
      isLike
    })
  });
  
  return await response.json();
}
```

## 图片上传示例

```typescript
// 上传玩家秀图片
async function uploadPlayerShowImage(file: File, name: string) {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('type', 'player-show');
  formData.append('name', name);
  
  const response = await fetch('http://localhost:7001/upload/', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}
``` 