import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';

const mockTodo = {
  id: '1',
  text: '学习 Vitest',
  completed: false
};

describe('TodoItem Component', () => {
  test('renders todo text', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    expect(screen.getByText('学习 Vitest')).toBeInTheDocument();
  });

  test('renders checkbox with correct state', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('renders completed todo with completed class', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const completedTodo = { ...mockTodo, completed: true };
    
    render(<TodoItem todo={completedTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const listItem = screen.getByText('学习 Vitest').closest('li');
    expect(listItem).toHaveClass('completed');
  });

  test('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('enters edit mode on double click', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const textElement = screen.getByText('学习 Vitest');
    await user.dblClick(textElement);
    
    expect(screen.getByDisplayValue('学习 Vitest')).toBeInTheDocument();
  });

  test('saves edit on Enter key', async () => {
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
    
    // Edit text
    const input = screen.getByDisplayValue('学习 Vitest');
    await user.clear(input);
    await user.type(input, '学习 React');
    await user.keyboard('{Enter}');
    
    expect(onEdit).toHaveBeenCalledWith('1', '学习 React');
  });

  test('cancels edit on Escape key', async () => {
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
    
    // Edit text
    const input = screen.getByDisplayValue('学习 Vitest');
    await user.clear(input);
    await user.type(input, '学习 React');
    await user.keyboard('{Escape}');
    
    // Should revert to original text
    expect(screen.getByText('学习 Vitest')).toBeInTheDocument();
    expect(onEdit).not.toHaveBeenCalled();
  });

  test('saves edit on blur', async () => {
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
    
    // Edit text
    const input = screen.getByDisplayValue('学习 Vitest');
    await user.clear(input);
    await user.type(input, '学习 React');
    await user.tab(); // This will blur the input
    
    expect(onEdit).toHaveBeenCalledWith('1', '学习 React');
  });

  test('does not call onEdit when text is unchanged', async () => {
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
    
    // Don't change text, just press Enter
    const input = screen.getByDisplayValue('学习 Vitest');
    await user.keyboard('{Enter}');
    
    expect(onEdit).not.toHaveBeenCalled();
  });

  test('deletes todo when edit text is empty', async () => {
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
    
    // Clear text
    const input = screen.getByDisplayValue('学习 Vitest');
    await user.clear(input);
    await user.keyboard('{Enter}');
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('has correct CSS classes', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const listItem = screen.getByText('学习 Vitest').closest('li');
    expect(listItem).toBeInTheDocument();
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('toggle');
    
    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toHaveClass('destroy');
  });

  test('has editing class when in edit mode', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);
    
    const textElement = screen.getByText('学习 Vitest');
    await user.dblClick(textElement);
    
    const listItem = screen.getByDisplayValue('学习 Vitest').closest('li');
    expect(listItem).toHaveClass('editing');
  });
}); 