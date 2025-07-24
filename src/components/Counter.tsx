import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

export const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  step = 1
}) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}; 