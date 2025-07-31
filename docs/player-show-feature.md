# 玩家秀功能设计文档

## 功能概述

玩家秀功能允许拥有某系列任意款式（已收货）的用户发布该系列的玩家秀，包括图片和文字内容。该功能包含完整的CRUD操作、审核机制、点赞功能等。

## 数据库设计

### PlayerShow 实体类

```typescript
@Entity('player_show')
export class PlayerShow {
    @PrimaryGeneratedColumn()
    id: number;

    // 用户关联
    @Column()
    @Index()
    userId: number;

    // 系列关联
    @Column()
    @Index()
    seriesId: number;

    // 玩家秀标题
    @Column({ length: 200, nullable: false })
    title: string;

    // 玩家秀内容文字
    @Column({ type: 'text', nullable: false })
    content: string;

    // 图片URL列表，JSON格式存储
    @Column({ type: 'text', nullable: false })
    images: string;

    // 是否置顶
    @Column({ type: 'boolean', default: false })
    isPinned: boolean;

    // 是否隐藏
    @Column({ type: 'boolean', default: false })
    isHidden: boolean;

    // 发布时间
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
```

## API 接口设计

### 1. 创建玩家秀
- **接口**: `POST /player-shows/create`
- **权限**: 需要登录
- **功能**: 创建新的玩家秀
- **验证**: 用户必须拥有该系列的已收货商品

### 2. 获取所有玩家秀列表
- **接口**: `GET /player-shows/list`
- **权限**: 公开接口
- **功能**: 获取所有玩家秀列表，返回id、用户、标题和第一张图

### 3. 获取我的玩家秀列表
- **接口**: `GET /player-shows/my/list`
- **权限**: 需要登录
- **功能**: 获取当前用户的玩家秀列表，返回id、用户、标题和第一张图

### 4. 获取玩家秀详情
- **接口**: `GET /player-shows/:id`
- **权限**: 公开接口
- **功能**: 获取指定玩家秀的详细信息

### 5. 删除玩家秀
- **接口**: `DELETE /player-shows/:id`
- **权限**: 需要登录，只能删除自己的玩家秀
- **功能**: 删除指定的玩家秀

## 业务逻辑

### 发布条件验证
- 用户必须拥有该系列的已收货商品
- 系列必须存在且有效



### 权限控制
- 用户只能删除自己的玩家秀

### 图片上传
- 支持多图片上传
- 图片存储在 `public/player-show/` 目录
- 图片URL以JSON数组格式存储

## 数据流转

1. **用户发布** → 直接显示在列表中

## 安全考虑

1. **权限验证**: 所有需要权限的接口都通过JWT中间件验证
2. **数据验证**: 使用DTO进行数据验证
3. **SQL注入防护**: 使用TypeORM的查询构建器
4. **文件上传安全**: 限制文件类型和大小

## 扩展功能

### 评论系统
- 可以扩展添加评论功能
- 支持回复评论
- 评论审核机制

### 标签系统
- 为玩家秀添加标签
- 按标签筛选和搜索

### 推荐系统
- 基于用户喜好的推荐
- 热门玩家秀推荐

### 活动系统
- 玩家秀比赛
- 投票功能
- 奖励机制

## 部署说明

1. 确保数据库表已创建（通过TypeORM自动同步）
2. 创建 `public/player-show/` 目录用于存储图片
3. 配置图片上传大小限制
4. 设置管理员权限验证

## 测试用例

参考 `src/test/player-show.test.ts` 文件中的测试用例，包括：
- 创建玩家秀
- 获取玩家秀列表
- 获取玩家秀详情
- 权限验证测试 