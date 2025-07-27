import { describe, test, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useCounter } from '../useCounter'

describe('useCounter Hook', () => {
  test('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  test('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current.count).toBe(10);
  });

  test('increments count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  test('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  test('resets to initial value', () => {
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

  test('setCount updates value directly', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.setCount(42);
    });
    
    expect(result.current.count).toBe(42);
  });

  test('multiple operations work correctly', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment(); // 11
      result.current.increment(); // 12
      result.current.decrement(); // 11
      result.current.setCount(20); // 20
    });
    
    expect(result.current.count).toBe(20);
  });

  test('functions are stable (memoized)', () => {
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