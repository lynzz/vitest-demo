import { useState, useEffect } from 'react';
import { fetchUserData, saveUserData } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const handleSave = async (updatedUser: User) => {
    try {
      await saveUserData(updatedUser);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!user) return <div>用户不存在</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => handleSave({...user, name: '新名字'})}>
        更新用户
      </button>
    </div>
  );
}; 