import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface UserCardProps {
  user: User;
  isActive?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  isActive = false 
}) => {
  return (
    <div className={`card ${isActive ? 'active' : ''}`}>
      <div className="card-header">
        {user.avatar && (
          <img src={user.avatar} alt={user.name} className="avatar" />
        )}
        <h3>{user.name}</h3>
      </div>
      <div className="card-body">
        <p className="email">{user.email}</p>
        <div className="status">
          {isActive ? '🟢 在线' : '⚫ 离线'}
        </div>
      </div>
    </div>
  );
}; 