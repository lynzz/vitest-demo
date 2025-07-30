import React, { useState, useCallback } from 'react';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { Todo } from './TodoItem';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    setTodos(prev => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }, []);

  const toggleAll = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prev =>
      prev.map(todo => ({ ...todo, completed: !allCompleted }))
    );
  }, [todos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const editTodo = useCallback((id: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, text: newText }
          : todo
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <TodoInput onAdd={addTodo} placeholder="What needs to be done?" />
        </header>

        {todos.length > 0 && (
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={allCompleted}
              onChange={toggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </section>
        )}

        {todos.length > 0 && (
          <footer className="footer">
            <span className="todo-count" role='todo-count'>
              <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
            </span>
            <ul className="filters">
              <li>
                <a
                  href="#/"
                  onClick={(e) => { e.preventDefault(); setFilter('all'); }}
                  className={filter === 'all' ? 'selected' : ''}
                >
                  All
                </a>
              </li>
              <li>
                <a
                  href="#/active"
                  onClick={(e) => { e.preventDefault(); setFilter('active'); }}
                  className={filter === 'active' ? 'selected' : ''}
                >
                  Active
                </a>
              </li>
              <li>
                <a
                  href="#/completed"
                  onClick={(e) => { e.preventDefault(); setFilter('completed'); }}
                  className={filter === 'completed' ? 'selected' : ''}
                >
                  Completed
                </a>
              </li>
            </ul>
            {completedCount > 0 && (
              <button className="clear-completed" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        )}
      </section>
      
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://github.com/petehunt/">petehunt</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </>
  );
};
