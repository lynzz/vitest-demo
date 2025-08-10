import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../TodoInput';

describe('TodoInput', () => {
  test('should render input with default placeholder', () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  test('should render with custom placeholder', () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} placeholder="输入任务..." />);
    
    expect(screen.getByPlaceholderText('输入任务...')).toBeInTheDocument();
  });

  test('should call onAdd when form is submitted with valid text', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    expect(onAdd).toHaveBeenCalledWith('学习 Vitest');
  });

  test('should clear input after adding todo', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    expect(input).toHaveValue('');
  });

  test('should not call onAdd when input is empty', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.keyboard('{Enter}');
    
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('should not call onAdd when input only contains whitespace', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('should trim whitespace from input', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '  学习 Vitest  ');
    await user.keyboard('{Enter}');
    
    expect(onAdd).toHaveBeenCalledWith('学习 Vitest');
  });

  test('should have correct CSS class', () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    expect(input).toHaveClass('new-todo');
  });
}); 