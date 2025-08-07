# web作业后端

## 环境配置
- node    v20.18.0
- npm     10.8.2
- 使用sqlite数据库

## 功能特性

### 价格管理功能
- **自动同步**: 使用TypeORM自动同步，无需手动创建数据库表
- **价格设置**: 支持设置商品基础价格
- **折扣管理**: 支持设置折扣系数（0-1之间）
- **自动计算**: 系统自动计算实际价格（价格 × 折扣系数）
- **级联删除**: 删除系列时自动删除相关价格记录

### API接口
- `POST /price/set-price` - 设置价格
- `POST /price/set-discount` - 设置折扣系数
- `PUT /price/:seriesId` - 更新价格信息
- `GET /price/:seriesId` - 获取价格信息
- `GET /price` - 获取所有价格信息
- `DELETE /price/:seriesId` - 删除价格记录
- `POST /price/batch-set-prices` - 批量设置价格
- `POST /price/batch-set-discounts` - 批量设置折扣系数

## 数据库自动同步

项目配置了TypeORM自动同步功能，启动应用时会自动创建必要的数据库表结构，无需手动执行SQL脚本。

### 配置位置
```typescript
// src/config/config.default.ts
typeorm: {
  dataSource: {
    default: {
      synchronize: true,  // 启用自动同步
      // ...
    }
  }
}
```

## 快速开始

1. 安装依赖
```bash
npm install
```

2. 启动应用
```bash
npm run dev
```

3. 应用启动后会自动创建price表

4. 测试价格API
```bash
# 设置价格
curl -X POST http://localhost:7001/price/set-price \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "seriesId": 1,
    "price": 99.99
  }'
```

## 项目结构

```
src/
├── entity/
│   ├── price.entity.ts          # 价格实体（自动同步）
│   └── series.entity.ts         # 系列实体（已更新关联）
├── dto/
│   └── price.dto.ts             # 价格数据传输对象
├── service/
│   └── price.service.ts         # 价格业务逻辑
├── controller/
│   └── price.controller.ts      # 价格API控制器
└── config/
    └── config.default.ts        # TypeORM自动同步配置
```

## 注意事项

- 开发环境使用自动同步，生产环境建议使用迁移文件
- 删除系列时会自动删除相关价格记录
- 折扣系数范围：0-1，1.00表示无折扣
- 所有价格API都需要JWT认证

## CI/CD 自动测试

项目已配置Git推送后自动触发测试的CI/CD流程：

### 功能特性
- **GitHub Actions**: 云端自动测试，支持多Node.js版本
- **Git Hooks**: 本地推送前测试，防止错误代码推送
- **测试覆盖**: 自动生成代码覆盖率报告

### 快速设置
```bash
# Windows
scripts\setup-ci.bat

# Linux/Mac
chmod +x scripts/setup-ci.sh
./scripts/setup-ci.sh
```

### 使用方法
```bash
# 推送代码（自动触发测试）
git push origin main

# 本地测试
npm run test

# 查看覆盖率
npm run cov
```

详细配置说明请查看 [CI/CD文档](docs/CI-CD.md)