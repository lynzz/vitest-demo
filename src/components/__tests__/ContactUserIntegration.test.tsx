import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactUserIntegration } from '../ContactUserIntegration'

describe('ContactUserIntegration - 真正的集成测试', () => {
  test('用户提交表单后，新用户应该出现在列表中', async () => {
    const user = userEvent.setup();
    
    render(<ContactUserIntegration />);
    
    // 等待初始用户列表加载
    await waitFor(() => {
      expect(screen.getByText('Admin - admin@example.com')).toBeInTheDocument();
    });
    
    // 填写表单
    await user.type(screen.getByPlaceholderText('Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@test.com');
    await user.type(screen.getByPlaceholderText('Message'), 'Hello World');
    
    // 提交表单
    await user.click(screen.getByText('Send'));
    
    // 验证提交状态
    expect(screen.getByText('正在添加用户...')).toBeInTheDocument();
    
    // 等待表单提交完成
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // 验证新用户出现在列表中
    await waitFor(() => {
      expect(screen.getByText('John Doe - john@test.com')).toBeInTheDocument();
    });
    
    // 验证用户列表包含两个用户（初始Admin + 新添加的John）
    const userItems = screen.getAllByRole('listitem');
    expect(userItems).toHaveLength(2);
    expect(userItems[0]).toHaveTextContent('Admin - admin@example.com');
    expect(userItems[1]).toHaveTextContent('John Doe - john@test.com');
  });

  test('多个用户提交后，列表应该正确更新', async () => {
    const user = userEvent.setup();
    
    render(<ContactUserIntegration />);
    
    // 等待初始加载
    await waitFor(() => {
      expect(screen.getByText('Admin - admin@example.com')).toBeInTheDocument();
    });
    
    // 添加第一个用户
    await user.type(screen.getByPlaceholderText('Name'), 'Alice');
    await user.type(screen.getByPlaceholderText('Email'), 'alice@test.com');
    await user.type(screen.getByPlaceholderText('Message'), 'First user');
    await user.click(screen.getByText('Send'));
    
    // 等待第一个用户添加完成
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // 验证第一个用户已添加
    await waitFor(() => {
      expect(screen.getByText('Alice - alice@test.com')).toBeInTheDocument();
    });
    
    // 重新渲染组件以重置表单状态（模拟页面刷新）
    render(<ContactUserIntegration />);
    
    // 添加第二个用户
    await user.type(screen.getByPlaceholderText('Name'), 'Bob');
    await user.type(screen.getByPlaceholderText('Email'), 'bob@test.com');
    await user.type(screen.getByPlaceholderText('Message'), 'Second user');
    await user.click(screen.getByText('Send'));
    
    // 等待第二个用户添加完成
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // 验证两个新用户都已添加
    await waitFor(() => {
      expect(screen.getByText('Alice - alice@test.com')).toBeInTheDocument();
      expect(screen.getByText('Bob - bob@test.com')).toBeInTheDocument();
    });
  });

  test('表单提交过程中应该显示正确的加载状态', async () => {
    const user = userEvent.setup();
    
    render(<ContactUserIntegration />);
    
    // 等待初始加载
    await waitFor(() => {
      expect(screen.getByText('Admin - admin@example.com')).toBeInTheDocument();
    });
    
    // 填写表单
    await user.type(screen.getByPlaceholderText('Name'), 'Test User');
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Message'), 'Test message');
    
    // 提交表单
    await user.click(screen.getByText('Send'));
    
    // 验证加载状态
    expect(screen.getByText('正在添加用户...')).toBeInTheDocument();
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    
    // 等待提交完成
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // 验证加载状态已消失
    expect(screen.queryByText('正在添加用户...')).not.toBeInTheDocument();
  });

  test('组件集成后的完整用户流程', async () => {
    const user = userEvent.setup();
    
    render(<ContactUserIntegration />);
    
    // 1. 验证初始状态
    await waitFor(() => {
      expect(screen.getByText('Admin - admin@example.com')).toBeInTheDocument();
    });
    expect(screen.getByText('添加新用户')).toBeInTheDocument();
    expect(screen.getByText('用户列表')).toBeInTheDocument();
    
    // 2. 填写并提交表单
    await user.type(screen.getByPlaceholderText('Name'), 'Integration Test');
    await user.type(screen.getByPlaceholderText('Email'), 'integration@test.com');
    await user.type(screen.getByPlaceholderText('Message'), 'This is an integration test');
    await user.click(screen.getByText('Send'));
    
    // 3. 验证提交过程
    expect(screen.getByText('正在添加用户...')).toBeInTheDocument();
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    
    // 4. 验证提交完成
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // 5. 验证用户列表更新
    await waitFor(() => {
      expect(screen.getByText('Integration Test - integration@test.com')).toBeInTheDocument();
    });
    
    // 6. 验证最终状态
    const userItems = screen.getAllByRole('listitem');
    expect(userItems).toHaveLength(2);
    expect(userItems[0]).toHaveTextContent('Admin - admin@example.com');
    expect(userItems[1]).toHaveTextContent('Integration Test - integration@test.com');
  });
}); 