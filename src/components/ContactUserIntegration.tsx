import React, { useState } from 'react';
import { ContactForm } from './ContactForm';
import { UserList } from './UserList';

interface User {
  id: number;
  name: string;
  email: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const ContactUserIntegration: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Admin', email: 'admin@example.com' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 模拟API调用 - 添加新用户
  const addUser = async (formData: FormData): Promise<void> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email
    };
    
    setUsers(prev => [...prev, newUser]);
  };

  // 模拟API调用 - 获取用户列表
  const fetchUsers = async (): Promise<User[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    return users;
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await addUser(formData);
    } catch (error) {
      console.error('Failed to add user:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-user-integration">
      <div className="form-section">
        <h2>添加新用户</h2>
        <ContactForm onSubmit={handleSubmit} />
        {isSubmitting && <div className="submitting">正在添加用户...</div>}
      </div>
      
      <div className="list-section">
        <h2>用户列表</h2>
        <UserList fetchUsers={fetchUsers} />
      </div>
    </div>
  );
}; 