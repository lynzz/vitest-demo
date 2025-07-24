import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Counter } from '../Counter'

describe('Counter Component', () => {
  test('renders with initial value', () => {
    render(<Counter initialValue={5} />);
    
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  test('renders with default initial value of 0', () => {
    render(<Counter />);
    
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  test('increments count when + button clicked', () => {
    render(<Counter />);
    
    fireEvent.click(screen.getByText('+'));
    
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  test('decrements count when - button clicked', () => {
    render(<Counter initialValue={5} />);
    
    fireEvent.click(screen.getByText('-'));
    
    expect(screen.getByTestId('count')).toHaveTextContent('4');
  });

  test('decrements with custom step', () => {
    render(<Counter initialValue={10} step={2} />);
    
    fireEvent.click(screen.getByText('-'));
    
    expect(screen.getByTestId('count')).toHaveTextContent('8');
  });

  test('increments with custom step', () => {
    render(<Counter initialValue={0} step={3} />);
    
    fireEvent.click(screen.getByText('+'));
    
    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });

  test('resets to initial value', () => {
    render(<Counter initialValue={5} />);
    
    // 先改变值
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByTestId('count')).toHaveTextContent('6');
    
    // 然后重置
    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  test('multiple operations work correctly', () => {
    render(<Counter initialValue={0} step={2} />);
    
    fireEvent.click(screen.getByText('+')); // +2 = 2
    fireEvent.click(screen.getByText('+')); // +2 = 4
    fireEvent.click(screen.getByText('-')); // -2 = 2
    
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });
}); 