import { describe, test, expect } from 'vitest'
import { add, multiply, divide } from '../math'

describe('Math Utils', () => {
  it('should add two numbers', () => {
    // Arrange
    const a = 2, b = 3;
    
    // Act
    const result = add(a, b);
    
    // Assert
    expect(result).toBe(5);
  });

  test('should multiply two numbers', () => {
    expect(multiply(4, 5)).toBe(20);
  });

  test('should throw error when dividing by zero', () => {
    expect(() => divide(10, 0))
      .toThrow('Division by zero');
  });

  test('should divide two numbers correctly', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(15, 3)).toBe(5);
  });

  test('should handle negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
    expect(multiply(-2, 3)).toBe(-6);
    expect(divide(-10, 2)).toBe(-5);
  });
}); 