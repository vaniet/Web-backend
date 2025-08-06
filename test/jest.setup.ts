// Jest 测试环境设置
import { join } from 'path';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Application } from '@midwayjs/koa';

// 全局测试设置
beforeAll(async () => {
  // 设置测试环境变量
  process.env.NODE_ENV = 'unittest';
});

// 创建测试应用实例
export async function createTestApp(): Promise<Application> {
  const app = await createApp(join(__dirname, '../src'), {
    cleanLogging: true,
    baseDir: join(__dirname, '../src'),
  });
  return app;
}

// 创建 HTTP 请求测试工具
export async function createHttpTest() {
    const app = await createTestApp();
    const request = createHttpRequest(app);

    return {
        app,
        request,
        async close() {
            await close(app);
        }
    };
}

// 测试数据清理
export async function cleanupTestData() {
    // 在这里添加测试数据清理逻辑
    // 例如：清理数据库、删除测试文件等
}

// 全局测试后清理
afterAll(async () => {
    // 清理测试环境
    await cleanupTestData();
}); 