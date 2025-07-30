import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from '../TodoApp';

describe('TodoApp Integration Tests', () => {
  test('renders todo app with title', () => {
    render(<TodoApp />);
    
    expect(screen.getByText('todos')).toBeInTheDocument();
  });

  test('adds new todo when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    expect(screen.getByText('学习 Vitest')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('toggles todo completion status', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    // Add a todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    // Toggle completion - use the first checkbox (not toggle-all)
    const checkboxes = screen.getAllByRole('checkbox');
    const todoCheckbox = checkboxes[1]; // Skip toggle-all checkbox
    await user.click(todoCheckbox);
    
    // Check if the todo has completed class
    const listItem = screen.getByText('学习 Vitest').closest('li');
    expect(listItem).toHaveClass('completed');
  });

  test('deletes todo when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    // Add a todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    expect(screen.getByText('学习 Vitest')).toBeInTheDocument();
    
    // Delete the todo
    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);
    
    expect(screen.queryByText('学习 Vitest')).not.toBeInTheDocument();
  });

  test('edits todo text on double click', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    // Add a todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    // Edit the todo
    const todoText = screen.getByText('学习 Vitest');
    await user.dblClick(todoText);
    
    const editInput = screen.getByDisplayValue('学习 Vitest');
    await user.clear(editInput);
    await user.type(editInput, '学习 React');
    await user.keyboard('{Enter}');
    
    expect(screen.getByText('学习 React')).toBeInTheDocument();
  });

  test('filters todos correctly', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    // Add multiple todos
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    await user.type(input, '学习 React');
    await user.keyboard('{Enter}');
    
    await user.type(input, '学习 TypeScript');
    await user.keyboard('{Enter}');
    
    // Complete one todo
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[2]); // Complete "学习 React"
    
    // Test active filter
    await user.click(screen.getByText('Active'));
    expect(screen.getByText(/学习 Vitest/)).toBeInTheDocument();
    expect(screen.getByText(/学习 TypeScript/)).toBeInTheDocument();
    expect(screen.queryByText(/学习 React/)).not.toBeInTheDocument();
    
    // Test completed filter
    await user.click(screen.getByText('Completed'));
    expect(screen.getByText(/学习 React/)).toBeInTheDocument();
    expect(screen.queryByText(/学习 Vitest/)).not.toBeInTheDocument();
    expect(screen.queryByText(/学习 TypeScript/)).not.toBeInTheDocument();
    
    // Test all filter
    await user.click(screen.getByText('All'));
    expect(screen.getByText(/学习 Vitest/)).toBeInTheDocument();
    expect(screen.getByText(/学习 React/)).toBeInTheDocument();
    expect(screen.getByText(/学习 TypeScript/)).toBeInTheDocument();
  });

  test('shows correct count of active todos', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    // Add multiple todos
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    await user.type(input, '学习 React');
    await user.keyboard('{Enter}');
    
    // Complete one todo
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[2]); // Complete "学习 React"
    
    // Check for the count text using a more specific selector
    const countElement = screen.getByRole('todo-count') || screen.getByText('1 item left');
    expect(countElement).toBeInTheDocument();
  });

  test('clears completed todos', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    // Add multiple todos
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    await user.type(input, '学习 React');
    await user.keyboard('{Enter}');
    
    // Complete both todos
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);
    await user.click(checkboxes[2]);
    
    // Clear completed
    await user.click(screen.getByText('Clear completed'));
    
    expect(screen.queryByText('学习 Vitest')).not.toBeInTheDocument();
    expect(screen.queryByText('学习 React')).not.toBeInTheDocument();
  });

  test('does not show clear completed button when no completed todos', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    // Add a todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    expect(screen.queryByText('Clear completed')).not.toBeInTheDocument();
  });

  test('toggles all todos when toggle all is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    // Add multiple todos
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '学习 Vitest');
    await user.keyboard('{Enter}');
    
    await user.type(input, '学习 React');
    await user.keyboard('{Enter}');
    
    // Toggle all
    const toggleAllCheckbox = screen.getByLabelText('Mark all as complete');
    await user.click(toggleAllCheckbox);
    
    // Check if toggle all checkbox is checked
    expect(toggleAllCheckbox).toBeChecked();
    
    // Toggle back to uncompleted
    await user.click(toggleAllCheckbox);
    
    // Check if toggle all checkbox is unchecked
    expect(toggleAllCheckbox).not.toBeChecked();
  });

  test('shows footer info', () => {
    render(<TodoApp />);
    
    expect(screen.getByText('Double-click to edit a todo')).toBeInTheDocument();
    expect(screen.getByText('Created by')).toBeInTheDocument();
    expect(screen.getByText('Part of')).toBeInTheDocument();
  });

  test('handles multiple rapid additions', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    // Add multiple todos quickly
    await user.type(input, 'Todo 1');
    await user.keyboard('{Enter}');
    
    await user.type(input, 'Todo 2');
    await user.keyboard('{Enter}');
    
    await user.type(input, 'Todo 3');
    await user.keyboard('{Enter}');
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Todo 3')).toBeInTheDocument();
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(3);
  });
}); 