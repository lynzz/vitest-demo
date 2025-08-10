import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';

const mockTodo = {
  id: '1',
  text: '学习 Vitest',
  completed: false
};

describe('TodoItem', () => {
  test('should render todo text', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    expect(screen.getByText('学习 Vitest')).toBeInTheDocument();
  });

  test('should render checkbox with correct state', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('should render completed todo with completed class', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const completedTodo = { ...mockTodo, completed: true };
    
    render(<TodoItem todo={completedTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const listItem = screen.getByText('学习 Vitest').closest('li');
    expect(listItem).toHaveClass('completed');
  });

  test('should call onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  test('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('should enter edit mode on double click', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const textElement = screen.getByText('学习 Vitest');
    await user.dblClick(textElement);
    
    expect(screen.getByDisplayValue('学习 Vitest')).toBeInTheDocument();
  });

  test('should save edit on Enter key', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={onToggle} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    );
    
    // Enter edit mode
    const textElement = screen.getByText('学习 Vitest');
    await user.dblClick(textElement);
    
    const editInput = screen.getByDisplayValue('学习 Vitest');
    await user.clear(editInput);
    await user.type(editInput, '学习 React');
    await user.keyboard('{Enter}');
    
    expect(onEdit).toHaveBeenCalledWith('1', '学习 React');
  });

  test('should cancel edit on Escape key', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    // Enter edit mode
    const textElement = screen.getByText('学习 Vitest');
    await user.dblClick(textElement);
    
    const editInput = screen.getByDisplayValue('学习 Vitest');
    await user.clear(editInput);
    await user.type(editInput, '学习 React');
    await user.keyboard('{Escape}');
    
    // Should revert to original text
    expect(screen.getByText('学习 Vitest')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('学习 React')).not.toBeInTheDocument();
  });

  test('should not save empty edit', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={onToggle} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    );
    
    // Enter edit mode
    const textElement = screen.getByText('学习 Vitest');
    await user.dblClick(textElement);
    
    const editInput = screen.getByDisplayValue('学习 Vitest');
    await user.clear(editInput);
    await user.keyboard('{Enter}');
    
    // Should not call onEdit with empty string
    expect(onEdit).not.toHaveBeenCalled();
  });

  test('should not save whitespace-only edit', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={onToggle} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    );
    
    // Enter edit mode
    const textElement = screen.getByText('学习 Vitest');
    await user.dblClick(textElement);
    
    const editInput = screen.getByDisplayValue('学习 Vitest');
    await user.clear(editInput);
    await user.type(editInput, '   ');
    await user.keyboard('{Enter}');
    
    // Should not call onEdit with whitespace-only string
    expect(onEdit).not.toHaveBeenCalled();
  });

  test('should trim whitespace from edit', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={onToggle} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    );
    
    // Enter edit mode
    const textElement = screen.getByText('学习 Vitest');
    await user.dblClick(textElement);
    
    const editInput = screen.getByDisplayValue('学习 Vitest');
    await user.clear(editInput);
    await user.type(editInput, '  学习 React  ');
    await user.keyboard('{Enter}');
    
    expect(onEdit).toHaveBeenCalledWith('1', '学习 React');
  });

  test('should save edit on blur', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={onToggle} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    );
    
    // Enter edit mode
    const textElement = screen.getByText('学习 Vitest');
    await user.dblClick(textElement);
    
    const editInput = screen.getByDisplayValue('学习 Vitest');
    await user.clear(editInput);
    await user.type(editInput, '学习 React');
    await user.tab(); // This will blur the input
    
    expect(onEdit).toHaveBeenCalledWith('1', '学习 React');
  });

  test('should have correct CSS classes', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const listItem = screen.getByText('学习 Vitest').closest('li');
    expect(listItem).toHaveClass('todo-item');
  });

  test('should have correct accessibility attributes', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Toggle todo completion');
    
    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toHaveAttribute('aria-label', 'Delete todo');
  });
}); 