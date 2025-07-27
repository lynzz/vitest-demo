import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../ContactForm'

describe('ContactForm Integration', () => {
  test('submits form with correct data', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(<ContactForm onSubmit={mockSubmit} />);
    
    // 填写表单
    await user.type(screen.getByPlaceholderText('Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@test.com');
    await user.type(screen.getByPlaceholderText('Message'), 'Hello World');
    
    // 提交表单
    await user.click(screen.getByText('Send'));
    
    // 验证调用
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@test.com',
      message: 'Hello World'
    });
  });

  test('shows success message after submission', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(<ContactForm onSubmit={mockSubmit} />);
    
    // 填写并提交表单
    await user.type(screen.getByPlaceholderText('Name'), 'John');
    await user.type(screen.getByPlaceholderText('Email'), 'john@test.com');
    await user.type(screen.getByPlaceholderText('Message'), 'Test');
    await user.click(screen.getByText('Send'));
    
    // 等待成功消息
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!'))
        .toBeInTheDocument();
    });
  });

  test('shows loading state during submission', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn(() => new Promise<void>(resolve => 
      setTimeout(() => resolve(), 100)
    ));
    
    render(<ContactForm onSubmit={mockSubmit} />);
    
    await user.type(screen.getByPlaceholderText('Name'), 'John');
    await user.type(screen.getByPlaceholderText('Email'), 'john@test.com');
    await user.type(screen.getByPlaceholderText('Message'), 'Test');
    
    await user.click(screen.getByText('Send'));
    
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('form fields are initially empty', () => {
    const mockSubmit = vi.fn();
    render(<ContactForm onSubmit={mockSubmit} />);
    
    expect(screen.getByPlaceholderText('Name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Email')).toHaveValue('');
    expect(screen.getByPlaceholderText('Message')).toHaveValue('');
  });

  test('form fields update on input', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    
    render(<ContactForm onSubmit={mockSubmit} />);
    
    await user.type(screen.getByPlaceholderText('Name'), 'Test Name');
    expect(screen.getByPlaceholderText('Name')).toHaveValue('Test Name');
  });
}); 