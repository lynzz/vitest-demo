import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { UserCard } from '../UserCard'

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg'
};

describe('UserCard Snapshots', () => {
  test('renders default state correctly', () => {
    const { container } = render(<UserCard user={mockUser} />);
    
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders active state correctly', () => {
    const { container } = render(
      <UserCard user={mockUser} isActive={true} />
    );
    
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders without avatar correctly', () => {
    const userWithoutAvatar = { ...mockUser, avatar: undefined };
    const { container } = render(<UserCard user={userWithoutAvatar} />);
    
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches inline snapshot', () => {
    const { container } = render(<UserCard user={mockUser} />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="card "
      >
        <div
          class="card-header"
        >
          <img
            alt="John Doe"
            class="avatar"
            src="https://example.com/avatar.jpg"
          />
          <h3>
            John Doe
          </h3>
        </div>
        <div
          class="card-body"
        >
          <p
            class="email"
          >
            john@example.com
          </p>
          <div
            class="status"
          >
            ⚫ 离线
          </div>
        </div>
      </div>
    `);
  });

  // 传统的属性测试（非快照）
  test('displays user name correctly', () => {
    const { getByText } = render(<UserCard user={mockUser} />);
    
    expect(getByText('John Doe')).toBeInTheDocument();
  });

  test('displays user email correctly', () => {
    const { getByText } = render(<UserCard user={mockUser} />);
    
    expect(getByText('john@example.com')).toBeInTheDocument();
  });

  test('shows online status when active', () => {
    const { getByText } = render(<UserCard user={mockUser} isActive={true} />);
    
    expect(getByText('🟢 在线')).toBeInTheDocument();
  });

  test('shows offline status when inactive', () => {
    const { getByText } = render(<UserCard user={mockUser} isActive={false} />);
    
    expect(getByText('⚫ 离线')).toBeInTheDocument();
  });

  test('applies active class when isActive is true', () => {
    const { container } = render(<UserCard user={mockUser} isActive={true} />);
    
    expect(container.firstChild).toHaveClass('card', 'active');
  });

  test('does not apply active class when isActive is false', () => {
    const { container } = render(<UserCard user={mockUser} isActive={false} />);
    
    expect(container.firstChild).toHaveClass('card');
    expect(container.firstChild).not.toHaveClass('active');
  });
}); 