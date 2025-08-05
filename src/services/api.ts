interface User {
  id: string;
  name: string;
  email: string;
}

// 模拟 API 调用
export const fetchUserData = async (): Promise<User> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 模拟 API 响应
  return {
    id: '1',
    name: '张三',
    email: 'zhang@example.com'
  };
};

export const saveUserData = async (user: User): Promise<void> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 模拟保存操作
  console.log('保存用户数据:', user);
}; 