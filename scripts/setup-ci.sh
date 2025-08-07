#!/bin/bash

echo "🚀 设置Git推送后自动触发测试..."

# 检查是否在Git仓库中
if [ ! -d ".git" ]; then
    echo "❌ 错误: 当前目录不是Git仓库"
    exit 1
fi

# 检查必要的文件是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 找不到package.json文件"
    exit 1
fi

if [ ! -f "jest.config.js" ]; then
    echo "❌ 错误: 找不到jest.config.js文件"
    exit 1
fi

echo "✅ 检查通过"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 运行测试确保配置正确
echo "🧪 运行测试..."
npm run test

if [ $? -eq 0 ]; then
    echo "✅ 测试通过"
else
    echo "❌ 测试失败，请检查测试配置"
    exit 1
fi

# 检查GitHub Actions配置
if [ ! -d ".github/workflows" ]; then
    echo "📁 创建GitHub Actions目录..."
    mkdir -p .github/workflows
fi

echo "✅ CI/CD配置完成！"

echo ""
echo "📋 使用说明:"
echo "1. 推送代码到GitHub: git push origin main"
echo "2. 查看测试结果: 在GitHub仓库的Actions标签页"
echo "3. 本地测试: npm run test"
echo "4. 查看覆盖率: npm run cov"
echo ""
echo "🔗 相关文件:"
echo "- .github/workflows/push-test.yml (GitHub Actions配置)"
echo "- .husky/pre-push (本地Git钩子)"
echo "- docs/CI-CD.md (详细文档)" 