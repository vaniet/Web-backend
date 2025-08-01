import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Application } from '@midwayjs/koa';
import { join } from 'path';

describe('/test/message.test.ts', () => {
  let app: Application;

  beforeAll(async () => {
    // 创建应用
    app = await createApp(join(__dirname, '../../src'), {
      clean: true,
    });
  });

  afterAll(async () => {
    // 关闭应用
    await close(app);
  });

  it('should create message', async () => {
    const result = await createHttpRequest(app)
      .post('/message/create')
      .send({
        seriesId: 1,
        content: '测试消息内容'
      });

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('消息创建成功');
    expect(result.body.data).toHaveProperty('id');
    expect(result.body.data.seriesId).toBe(1);
    expect(result.body.data.content).toBe('测试消息内容');
  });

  it('should get message by id', async () => {
    // 先创建一个消息
    const createResult = await createHttpRequest(app)
      .post('/message/create')
      .send({
        seriesId: 2,
        content: '测试消息2'
      });

    const messageId = createResult.body.data.id;

    // 然后获取这个消息
    const result = await createHttpRequest(app)
      .get(`/message/${messageId}`);

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBe(messageId);
    expect(result.body.data.seriesId).toBe(2);
  });

  it('should get message by series id', async () => {
    const result = await createHttpRequest(app)
      .get('/message/series/2');

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.data.seriesId).toBe(2);
  });

  it('should get all messages', async () => {
    const result = await createHttpRequest(app)
      .get('/message/all');

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(Array.isArray(result.body.data)).toBe(true);
  });

  it('should update message', async () => {
    // 先创建一个消息
    const createResult = await createHttpRequest(app)
      .post('/message/create')
      .send({
        seriesId: 3,
        content: '原始内容'
      });

    const messageId = createResult.body.data.id;

    // 然后更新这个消息
    const result = await createHttpRequest(app)
      .put(`/message/${messageId}`)
      .send({
        content: '更新后的内容'
      });

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('消息更新成功');
    expect(result.body.data.content).toBe('更新后的内容');
  });

  it('should delete message by id', async () => {
    // 先创建一个消息
    const createResult = await createHttpRequest(app)
      .post('/message/create')
      .send({
        seriesId: 4,
        content: '要删除的消息'
      });

    const messageId = createResult.body.data.id;

    // 然后删除这个消息
    const result = await createHttpRequest(app)
      .del(`/message/${messageId}`);

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('消息删除成功');
  });

  it('should delete message by series id', async () => {
    // 先创建一个消息
    await createHttpRequest(app)
      .post('/message/create')
      .send({
        seriesId: 5,
        content: '要删除的消息'
      });

    // 然后根据系列ID删除这个消息
    const result = await createHttpRequest(app)
      .del('/message/series/5');

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('消息删除成功');
  });

  it('should return error when series not exists', async () => {
    const result = await createHttpRequest(app)
      .post('/message/create')
      .send({
        seriesId: 999,
        content: '测试消息'
      });

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(400);
    expect(result.body.message).toBe('系列不存在');
  });

  it('should return error when message not exists', async () => {
    const result = await createHttpRequest(app)
      .get('/message/999');

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(404);
    expect(result.body.message).toBe('消息不存在');
  });
}); 