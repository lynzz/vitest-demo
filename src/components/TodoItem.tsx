import React, { useState, useEffect, useRef } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInput = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      if (onEdit) {
        onEdit(todo.id, trimmedText);
      }
    } else if (!trimmedText) {
      // If the new text is empty, we delete the todo
      onDelete(todo.id);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && editInput.current) {
      editInput.current.focus();
    }
  }, [isEditing]);

  const liClasses = [
    isEditing ? "editing" : "",
    todo.completed ? "completed" : ""
  ].filter(Boolean).join(" ");

  return (
    <li className={liClasses}>
      {!isEditing ? (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <label onDoubleClick={handleDoubleClick}>
            {todo.text}
          </label>
          <button
            className="destroy"
            onClick={() => onDelete(todo.id)}
          />
        </div>
      ) : (
        <input
          ref={editInput}
          className="edit"
          value={editText}
          onBlur={handleSave}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};
