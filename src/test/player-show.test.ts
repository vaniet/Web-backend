import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Application } from '@midwayjs/koa';

describe('PlayerShow API Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await close(app);
  });

  it('should create player show', async () => {
    // 首先登录获取token
    const loginResult = await createHttpRequest(app)
      .post('/users/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    let token = '';
    if (loginResult.status === 200) {
      token = loginResult.body.data.token;
    }

    // 创建玩家秀
    const result = await createHttpRequest(app)
      .post('/player-shows/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        seriesId: 1,
        title: '我的第一个玩家秀',
        content: '这是我购买的盲盒，非常喜欢！',
        images: ['player-show/test1.jpg', 'player-show/test2.jpg']
      });

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
  });

  it('should get player show list', async () => {
    const result = await createHttpRequest(app)
      .get('/player-shows/list')
      .query({
        page: 1,
        limit: 10
      });

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
  });

  it('should get player show detail', async () => {
    const result = await createHttpRequest(app)
      .get('/player-shows/1');

    expect(result.status).toBe(200);
  });
}); 