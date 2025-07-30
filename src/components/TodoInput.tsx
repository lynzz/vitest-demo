import React, { useState } from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
  placeholder?: string;
}

export const TodoInput: React.FC<TodoInputProps> = ({
  onAdd,
  placeholder = "What needs to be done?"
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAdd(trimmedText);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="new-todo"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
    </form>
  );
};
