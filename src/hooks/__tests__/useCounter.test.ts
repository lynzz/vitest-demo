import { describe, test, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  test('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current.count).toBe(10);
  });

  test('should increment count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  test('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  test('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(3));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(5);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(3);
  });

  test('should update value directly when setCount is called', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.setCount(42);
    });
    
    expect(result.current.count).toBe(42);
  });

  test('should handle multiple operations correctly', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment(); // 11
      result.current.increment(); // 12
      result.current.decrement(); // 11
      result.current.setCount(20); // 20
    });
    
    expect(result.current.count).toBe(20);
  });

  test('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useCounter(0));
    
    const initialIncrement = result.current.increment;
    const initialDecrement = result.current.decrement;
    const initialReset = result.current.reset;
    
    rerender();
    
    expect(result.current.increment).toBe(initialIncrement);
    expect(result.current.decrement).toBe(initialDecrement);
    expect(result.current.reset).toBe(initialReset);
  });
}); 