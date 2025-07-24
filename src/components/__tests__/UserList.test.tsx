import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { UserList } from '../UserList'

const mockUsers = [
  { id: 1, name: 'John', email: 'john@test.com' },
  { id: 2, name: 'Jane', email: 'jane@test.com' }
];

describe('UserList Component', () => {
  test('shows loading initially', () => {
    const fetchUsers = vi.fn(() => new Promise(() => {}));
    render(<UserList fetchUsers={fetchUsers} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays users after successful fetch', async () => {
    const fetchUsers = vi.fn().mockResolvedValue(mockUsers);
    render(<UserList fetchUsers={fetchUsers} />);
    
    await waitFor(() => {
      expect(screen.getByText('John - john@test.com'))
        .toBeInTheDocument();
    });
    
    expect(screen.getByText('Jane - jane@test.com'))
      .toBeInTheDocument();
    expect(fetchUsers).toHaveBeenCalledTimes(1);
  });

  test('shows error when fetch fails', async () => {
    const fetchUsers = vi.fn()
      .mockRejectedValue(new Error('Failed to fetch'));
    render(<UserList fetchUsers={fetchUsers} />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch'))
        .toBeInTheDocument();
    });
  });

  test('handles empty user list', async () => {
    const fetchUsers = vi.fn().mockResolvedValue([]);
    render(<UserList fetchUsers={fetchUsers} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('calls fetchUsers on mount', () => {
    const fetchUsers = vi.fn().mockResolvedValue(mockUsers);
    render(<UserList fetchUsers={fetchUsers} />);
    
    expect(fetchUsers).toHaveBeenCalledTimes(1);
  });
}); 