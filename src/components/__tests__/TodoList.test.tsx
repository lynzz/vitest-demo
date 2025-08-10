import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../TodoList';

const mockTodos = [
  { id: '1', text: '学习 Vitest', completed: false },
  { id: '2', text: '学习 React', completed: true },
  { id: '3', text: '学习 TypeScript', completed: false }
];

describe('TodoList', () => {
  test('should render all todos', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={onToggle} 
        onDelete={onDelete} 
      />
    );
    
    expect(screen.getByText('学习 Vitest')).toBeInTheDocument();
    expect(screen.getByText('学习 React')).toBeInTheDocument();
    expect(screen.getByText('学习 TypeScript')).toBeInTheDocument();
  });

  test('should render empty list when no todos', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <TodoList 
        todos={[]} 
        onToggle={onToggle} 
        onDelete={onDelete} 
      />
    );
    
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(0);
  });

  test('should call onToggle when todo checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={onToggle} 
        onDelete={onDelete} 
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  test('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={onToggle} 
        onDelete={onDelete} 
      />
    );
    
    const deleteButtons = screen.getAllByRole('button');
    await user.click(deleteButtons[0]);
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('should call onEdit when todo is edited', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={onToggle} 
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    
    // Double click to enter edit mode
    const todoText = screen.getByText('学习 Vitest');
    await user.dblClick(todoText);
    
    const editInput = screen.getByDisplayValue('学习 Vitest');
    await user.clear(editInput);
    await user.type(editInput, '学习 Vitest 2.0');
    await user.keyboard('{Enter}');
    
    expect(onEdit).toHaveBeenCalledWith('1', '学习 Vitest 2.0');
  });

  test('should render correct number of todo items', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={onToggle} 
        onDelete={onDelete} 
      />
    );
    
    const todoItems = screen.getAllByRole('checkbox');
    expect(todoItems).toHaveLength(3);
  });

  test('should have correct CSS classes', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={onToggle} 
        onDelete={onDelete} 
      />
    );
    
    const list = screen.getByRole('list');
    expect(list).toHaveClass('todo-list');
  });
}); 