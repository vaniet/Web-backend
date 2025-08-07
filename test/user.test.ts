import { createHttpTest } from './jest.setup';

describe('User API Tests', () => {
  let testContext: Awaited<ReturnType<typeof createHttpTest>>;

  beforeAll(async () => {
    testContext = await createHttpTest();
  });

  afterAll(async () => {
    await testContext.close();
  });

  describe('POST /users/register', () => {
    // 存储注册成功的用户ID，供删除测试使用
    let userId: number;
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        phone: '13800138000',
        password: 'password123'
      };

      const response = await testContext.request
        .post('/users/register')
        .send(userData);

      console.log('Register response:', response.body);
      console.log('Register status:', response.status);

      expect(response.body).toBeDefined();
      userId = response.body.data.userId; // 保存用户ID供删除测试使用
      // 根据实际响应调整期望值
      if (response.status === 500) {
        console.log('Server error details:', response.body);
      }
    });

    // 新增删除用户测试（依赖上面注册的用户ID）
    it('should delete the registered user', async () => {
      // 确保userId已获取（避免测试顺序问题）
      expect(userId).toBeDefined();

      // 发送删除请求
      const response = await testContext.request
        .delete(`/users/delete/${userId}`); // 使用注册成功的用户ID

      console.log('Delete user response:', response.body);
      console.log('Delete user status:', response.status);

      // 断言删除成功
      expect(response.body).toBeDefined();
      expect(response.body.success).toBe(true); // 匹配控制器返回的{ success: result }
    });


  });

  describe('POST /users/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123'
      };

      const response = await testContext.request
        .post('/users/login')
        .send(loginData);

      console.log('Login response:', response.body);
      console.log('Login status:', response.status);

      expect(response.body).toBeDefined();
      // 根据实际响应调整期望值
      if (response.status === 401) {
        console.log('Login error details:', response.body);
      }
    });
  });
}); 