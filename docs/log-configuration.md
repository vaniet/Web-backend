# 日志配置说明

## 概述

本项目已优化日志输出，减少敏感信息和不必要内容的输出，提高日志的可读性和安全性。

## 主要优化

### 1. 数据库日志优化
- 关闭了SQL查询日志输出 (`logging: false`)
- 避免在日志中暴露数据库查询语句和参数

### 2. 请求日志优化
- 简化了请求日志格式
- 移除了敏感的请求头信息
- 根据响应时间分类日志级别：
  - 响应时间 > 1000ms: WARN级别
  - 响应时间 > 500ms: INFO级别
  - 响应时间 ≤ 500ms: DEBUG级别

### 3. 错误日志优化
- 过滤SQL错误中的敏感查询信息
- 在生产环境中隐藏内部错误详情
- 只在开发环境记录详细的堆栈信息

### 4. 日志清理
- 提供自动清理脚本，保留最近7天的日志
- 定期清理过期日志文件，节省存储空间

## 日志级别

### INFO级别
- 正常的请求处理
- 业务操作记录
- 系统状态信息

### WARN级别
- 慢请求警告 (>1000ms)
- 业务异常（如记录不存在）
- 配置问题

### ERROR级别
- 系统错误
- 数据库连接问题
- 未捕获的异常

### DEBUG级别
- 快速请求 (<500ms)
- 详细的调试信息（仅开发环境）

## 敏感信息过滤

以下信息会被自动过滤，不会出现在日志中：
- 请求头信息 (headers)
- 查询参数 (query parameters)
- 数据库查询语句
- 用户认证信息
- 文件路径等系统信息

## 日志文件

### 文件位置
- 应用日志: `logs/my-midway-project/midway-app.log.YYYY-MM-DD`
- 错误日志: `logs/my-midway-project/common-error.log.YYYY-MM-DD`
- 核心日志: `logs/my-midway-project/midway-core.log.YYYY-MM-DD`

### 日志格式
```
时间戳 级别 进程ID [请求信息] 消息内容
```

## 使用命令

### 清理日志
```bash
npm run clean-logs
```

### 查看实时日志
```bash
# 查看应用日志
tail -f logs/my-midway-project/midway-app.log.$(date +%Y-%m-%d)

# 查看错误日志
tail -f logs/my-midway-project/common-error.log.$(date +%Y-%m-%d)
```

## 配置说明

### 开发环境
- 显示详细的错误信息
- 记录完整的堆栈跟踪
- 启用调试日志

### 生产环境
- 隐藏内部错误详情
- 只记录关键信息
- 自动清理过期日志

## 注意事项

1. **日志轮转**: 系统会自动按日期分割日志文件
2. **存储空间**: 建议定期运行清理脚本，避免日志文件过大
3. **安全考虑**: 生产环境中不会记录敏感信息
4. **性能影响**: 日志记录对性能影响最小化

## 故障排查

### 常见问题

1. **日志文件过大**
   ```bash
   npm run clean-logs
   ```

2. **查看特定错误**
   ```bash
   grep "ERROR" logs/my-midway-project/common-error.log.$(date +%Y-%m-%d)
   ```

3. **监控慢请求**
   ```bash
   grep "WARN.*Slow request" logs/my-midway-project/midway-app.log.$(date +%Y-%m-%d)
   ``` 