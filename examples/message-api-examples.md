# Message API 使用示例

## 接口列表

### 1. 创建消息
**POST** `/message/create`

**请求体:**
```json
{
  "seriesId": 1,
  "content": "这是一个测试消息内容"
}
```

**响应:**
```json
{
  "code": 200,
  "message": "消息创建成功",
  "data": {
    "id": 1,
    "seriesId": 1,
    "content": "这是一个测试消息内容",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. 根据ID获取消息
**GET** `/message/:id`

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "seriesId": 1,
    "content": "这是一个测试消息内容",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "series": {
      "id": 1,
      "name": "测试系列",
      "styleCount": 3,
      "cover": "test.jpg",
      "description": "测试描述",
      "detail": "测试详情"
    }
  }
}
```

### 3. 根据系列ID获取消息
**GET** `/message/series/:seriesId`

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "seriesId": 1,
    "content": "这是一个测试消息内容",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "series": {
      "id": 1,
      "name": "测试系列",
      "styleCount": 3,
      "cover": "test.jpg",
      "description": "测试描述",
      "detail": "测试详情"
    }
  }
}
```

### 4. 获取所有消息
**GET** `/message/all`

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "seriesId": 1,
      "content": "消息1",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "series": {
        "id": 1,
        "name": "系列1",
        "styleCount": 3
      }
    },
    {
      "id": 2,
      "seriesId": 2,
      "content": "消息2",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "series": {
        "id": 2,
        "name": "系列2",
        "styleCount": 5
      }
    }
  ]
}
```

### 5. 更新消息内容
**PUT** `/message/:id`

**请求体:**
```json
{
  "content": "更新后的消息内容"
}
```

**响应:**
```json
{
  "code": 200,
  "message": "消息更新成功",
  "data": {
    "id": 1,
    "seriesId": 1,
    "content": "更新后的消息内容",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

### 6. 根据ID删除消息
**DELETE** `/message/:id`

**响应:**
```json
{
  "code": 200,
  "message": "消息删除成功",
  "data": null
}
```

### 7. 根据系列ID删除消息
**DELETE** `/message/series/:seriesId`

**响应:**
```json
{
  "code": 200,
  "message": "消息删除成功",
  "data": null
}
```

## 错误响应示例

### 系列不存在
```json
{
  "code": 400,
  "message": "系列不存在",
  "data": null
}
```

### 消息不存在
```json
{
  "code": 404,
  "message": "消息不存在",
  "data": null
}
```

### 该系列已存在消息记录
```json
{
  "code": 400,
  "message": "该系列已存在消息记录",
  "data": null
}
```

## 使用场景

1. **手动上传信息**: 使用 `POST /message/create` 接口为特定系列创建消息
2. **删除已有信息**: 使用 `DELETE /message/:id` 或 `DELETE /message/series/:seriesId` 删除消息
3. **查询消息**: 使用 `GET /message/:id` 或 `GET /message/series/:seriesId` 查询特定消息
4. **更新消息**: 使用 `PUT /message/:id` 更新消息内容
5. **批量查询**: 使用 `GET /message/all` 获取所有消息列表 