import { describe, test, expect } from 'vitest'
import { 
  fetchData, 
  verySlowFunction, 
  fetchUserData, 
  apiCall, 
  getPromise 
} from '../asyncUtils'

describe('异步测试常见问题示例', () => {
  
  // ❌ 常见问题1: 忘记 await
  test('❌ 错误: 忘记 await', () => {
    // 这个测试看起来会通过，但实际上在测试 Promise 对象而不是解析值
    const result = fetchData(); // 缺少 await
    // expect(result).toBe('data'); // 这会失败，因为 result 是 Promise
    expect(result).toBeInstanceOf(Promise); // 实际测试的是 Promise 对象
  });

  // ✅ 正确做法
  test('✅ 正确: 使用 await', async () => {
    const result = await fetchData();
    expect(result).toBe('data');
  });

  // ❌ 常见问题2: 超时问题（这个测试会超时失败）
  test.skip('❌ 错误: 默认超时（5秒）测试慢函数', async () => {
    // 这个测试会失败，因为函数需要8秒，但默认超时是5秒
    const result = await verySlowFunction();
    expect(result).toBe('success');
  });

  // ✅ 正确做法: 设置更长的超时时间
  test('✅ 正确: 设置超时时间', async () => {
    const result = await verySlowFunction();
    expect(result).toBe('success');
  }, 10000); // 10秒超时

  // ✅ 测试异步错误处理
  test('✅ 正确: 测试异步错误', async () => {
    await expect(fetchUserData(-1)).rejects.toThrow('Invalid user ID');
  });

  // ✅ 测试成功的异步调用
  test('✅ 正确: 测试异步成功调用', async () => {
    const userData = await fetchUserData(1);
    expect(userData).toEqual({ id: 1, name: 'User 1' });
  });

  // ✅ 使用 resolves 匹配器
  test('✅ 正确: 使用 resolves 匹配器', async () => {
    await expect(fetchData()).resolves.toBe('data');
  });

  // ✅ 使用 rejects 匹配器
  test('✅ 正确: 使用 rejects 匹配器', async () => {
    await expect(apiCall('/error')).rejects.toThrow('Network error');
  });

  // ✅ 测试多个异步操作
  test('✅ 正确: 测试多个异步操作', async () => {
    const [data1, data2, userData] = await Promise.all([
      fetchData(),
      getPromise(),
      fetchUserData(2)
    ]);

    expect(data1).toBe('data');
    expect(data2).toBe(42);
    expect(userData.name).toBe('User 2');
  });

  // ✅ 测试API调用的成功情况
  test('✅ 正确: 测试API成功调用', async () => {
    const response = await apiCall('/users');
    expect(response.status).toBe('ok');
    expect(response.data).toContain('/users');
  });
});

describe('异步测试最佳实践', () => {
  
  test('使用 async/await 而不是 .then()', async () => {
    // ✅ 推荐: 使用 async/await
    const result = await fetchData();
    expect(result).toBe('data');
    
    // ❌ 不推荐: 使用 .then() (虽然也能工作)
    // return fetchData().then(result => {
    //   expect(result).toBe('data');
    // });
  });

  test('正确处理并发异步操作', async () => {
    const start = Date.now();
    
    // 并发执行多个异步操作
    const results = await Promise.all([
      fetchData(),
      fetchData(),
      fetchData()
    ]);
    
    const duration = Date.now() - start;
    
    expect(results).toEqual(['data', 'data', 'data']);
    // 并发执行应该比串行执行快
    expect(duration).toBeLessThan(200); // 应该接近100ms而不是300ms
  });

  test('使用 waitFor 等待异步状态变化', async () => {
    let status = 'loading';
    
    // 模拟异步状态变化
    setTimeout(() => {
      status = 'completed';
    }, 100);
    
    // 等待状态变化
    await new Promise(resolve => {
      const checkStatus = () => {
        if (status === 'completed') {
          resolve(undefined);
        } else {
          setTimeout(checkStatus, 10);
        }
      };
      checkStatus();
    });
    
    expect(status).toBe('completed');
  });
}); 