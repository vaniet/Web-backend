# CI/CD 自动测试配置

## 概述

本项目已配置了Git推送后自动触发测试的CI/CD流程，包括：

1. **GitHub Actions**: 云端自动测试
2. **Git Hooks**: 本地推送前测试
3. **测试覆盖**: 代码覆盖率报告

## 配置说明

### GitHub Actions 工作流

创建了两个工作流文件：

- `.github/workflows/test.yml`: 完整的测试工作流（支持多Node.js版本）
- `.github/workflows/push-test.yml`: 简化的推送测试工作流

#### 触发条件

- 推送到 `main`, `master`, `develop` 分支
- 推送到 `feature/*`, `hotfix/*` 分支
- 创建Pull Request

#### 执行步骤

1. 检出代码
2. 设置Node.js环境
3. 安装依赖 (`npm ci`)
4. 运行单元测试 (`npm run test`)
5. 生成测试覆盖率报告 (`npm run cov`)
6. 上传覆盖率到Codecov

### Git Hooks (本地)

使用Husky配置了pre-push钩子：

- 在每次 `git push` 前自动运行测试
- 如果测试失败，推送会被阻止

## 使用方法

### 1. 推送代码触发测试

```bash
# 正常推送，会自动触发GitHub Actions测试
git push origin main
```

### 2. 本地测试

```bash
# 运行所有测试
npm run test

# 运行测试并生成覆盖率报告
npm run cov
```

### 3. 查看测试结果

- GitHub Actions: 在GitHub仓库的Actions标签页查看
- 本地覆盖率报告: `coverage/index.html`
- Codecov: 在线查看覆盖率报告

## 测试配置

### Jest配置

- 测试文件: `test/**/*.test.ts`, `test/**/*.spec.ts`
- 测试环境: Node.js
- 超时时间: 10秒
- 覆盖率报告: HTML, LCOV格式

### 测试脚本

```json
{
  "test": "cross-env NODE_ENV=unittest jest",
  "cov": "jest --coverage"
}
```

## 故障排除

### 常见问题

1. **测试失败**: 检查测试文件是否正确，确保所有依赖已安装
2. **覆盖率报告缺失**: 确保运行了 `npm run cov` 命令
3. **Git Hooks不工作**: 确保Husky已正确安装和配置

### 调试命令

```bash
# 检查Husky配置
npx husky --help

# 手动运行测试
npm run test

# 检查Git Hooks
ls -la .husky/
```

## 自定义配置

### 修改触发分支

编辑 `.github/workflows/push-test.yml`:

```yaml
on:
  push:
    branches: [ main, master, develop, feature/*, hotfix/* ]
```

### 修改测试命令

编辑 `package.json` 中的scripts部分。

### 添加更多测试步骤

在GitHub Actions工作流中添加新的步骤。 