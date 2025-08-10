import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '../UserProfile';

// 🌐 Mock 整个 API 模块
vi.mock('../../services/api', () => ({
  fetchUserData: vi.fn(),
  saveUserData: vi.fn()
}));

// 导入 mock 的函数
import { fetchUserData, saveUserData } from '../../services/api';

describe('UserProfile', () => {
  beforeEach(() => {
    // 🔄 每个测试前重置 mock
    vi.clearAllMocks();
  });

  test('should display user data when API call succeeds', async () => {
    // 🎭 设置 mock 返回值
    const mockUser = { id: '1', name: '张三', email: 'zhang@example.com' };
    vi.mocked(fetchUserData).mockResolvedValue(mockUser);

    render(<UserProfile />);

    // 等待异步操作完成
    await waitFor(() => {
      expect(screen.getByText('张三')).toBeInTheDocument();
    });

    expect(screen.getByText('zhang@example.com')).toBeInTheDocument();
  });

  test('should display error when API call fails', async () => {
    // 🎭 模拟 API 错误
    vi.mocked(fetchUserData).mockRejectedValue(new Error('网络错误'));

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('错误: 网络错误')).toBeInTheDocument();
    });
  });

  test('should call saveUserData when update button is clicked', async () => {
    const mockUser = { id: '1', name: '张三', email: 'zhang@example.com' };
    vi.mocked(fetchUserData).mockResolvedValue(mockUser);
    vi.mocked(saveUserData).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('张三')).toBeInTheDocument();
    });

    await user.click(screen.getByText('更新用户'));

    // ✅ 验证 saveUserData 被调用
    expect(saveUserData).toHaveBeenCalledWith({
      id: '1',
      name: '新名字',
      email: 'zhang@example.com'
    });
  });

  test('should handle save error correctly', async () => {
    const mockUser = { id: '1', name: '张三', email: 'zhang@example.com' };
    vi.mocked(fetchUserData).mockResolvedValue(mockUser);
    vi.mocked(saveUserData).mockRejectedValue(new Error('保存失败'));

    const user = userEvent.setup();
    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('张三')).toBeInTheDocument();
    });

    await user.click(screen.getByText('更新用户'));

    await waitFor(() => {
      expect(screen.getByText('错误: 保存失败')).toBeInTheDocument();
    });
  });

  test('should show loading state initially', () => {
    vi.mocked(fetchUserData).mockImplementation(() => 
      new Promise(() => {}) // 永不解析的 Promise
    );

    render(<UserProfile />);

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  test('should show user not found when API returns null', async () => {
    vi.mocked(fetchUserData).mockResolvedValue(null as any);

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('用户不存在')).toBeInTheDocument();
    });
  });
}); 