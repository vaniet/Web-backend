@echo off
echo 🚀 设置Git推送后自动触发测试...

REM 检查是否在Git仓库中
if not exist ".git" (
    echo ❌ 错误: 当前目录不是Git仓库
    exit /b 1
)

REM 检查必要的文件是否存在
if not exist "package.json" (
    echo ❌ 错误: 找不到package.json文件
    exit /b 1
)

if not exist "jest.config.js" (
    echo ❌ 错误: 找不到jest.config.js文件
    exit /b 1
)

echo ✅ 检查通过

REM 安装依赖
echo 📦 安装依赖...
call npm install

REM 运行测试确保配置正确
echo 🧪 运行测试...
call npm run test

if %errorlevel% neq 0 (
    echo ❌ 测试失败，请检查测试配置
    exit /b 1
)

echo ✅ 测试通过

REM 检查GitHub Actions配置
if not exist ".github\workflows" (
    echo 📁 创建GitHub Actions目录...
    mkdir .github\workflows
)

echo ✅ CI/CD配置完成！

echo.
echo 📋 使用说明:
echo 1. 推送代码到GitHub: git push origin main
echo 2. 查看测试结果: 在GitHub仓库的Actions标签页
echo 3. 本地测试: npm run test
echo 4. 查看覆盖率: npm run cov
echo.
echo 🔗 相关文件:
echo - .github/workflows/push-test.yml (GitHub Actions配置)
echo - .husky/pre-push (本地Git钩子)
echo - docs/CI-CD.md (详细文档) 