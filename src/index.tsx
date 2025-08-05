import React from 'react';
import ReactDOM from 'react-dom/client';
import { TodoApp } from './components/TodoApp';
import './index.css';
import { UserProfile } from './components/UserProfile';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TodoApp />
    <UserProfile/>
  </React.StrictMode>
); 