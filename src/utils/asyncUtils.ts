// 异步工具函数 - 用于演示异步测试的各种场景

// 快速异步函数
export async function fetchData(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('data');
    }, 100);
  });
}

// 慢速异步函数 (需要较长时间)
export async function verySlowFunction(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success');
    }, 8000); // 8秒，超过默认5秒超时
  });
}

// 可能失败的异步函数
export async function fetchUserData(userId: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId <= 0) {
        reject(new Error('Invalid user ID'));
      } else {
        resolve({ id: userId, name: `User ${userId}` });
      }
    }, 200);
  });
}

// 模拟API调用
export async function apiCall(endpoint: string): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint === '/error') {
        reject(new Error('Network error'));
      } else {
        resolve({ status: 'ok', data: `Response from ${endpoint}` });
      }
    }, 300);
  });
}

// 返回Promise的函数（不是async）
export function getPromise(): Promise<number> {
  return Promise.resolve(42);
} 