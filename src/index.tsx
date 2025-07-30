import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/Button';
import { Counter } from './components/Counter';
import { UserList } from './components/UserList';
import { ContactForm } from './components/ContactForm';
import { ContactUserIntegration } from './components/ContactUserIntegration';
import { useCounter } from './hooks/useCounter';
import { fetchData, verySlowFunction, fetchUserData, apiCall } from './utils/asyncUtils';

// 模拟用户数据获取
const fetchUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com' }
  ];
};

// 模拟表单提交
const handleFormSubmit = async (data: any) => {
  console.log('Form submitted:', data);
  await new Promise(resolve => setTimeout(resolve, 1000));
};

// 异步工具函数演示
const AsyncUtilsDemo: React.FC = () => {
  const [results, setResults] = React.useState<any>({});
  const [loading, setLoading] = React.useState<string | null>(null);

  const runAsyncTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(testName);
    try {
      const result = await testFn();
      setResults((prev: any) => ({ ...prev, [testName]: result }));
    } catch (error) {
      setResults((prev: any) => ({ ...prev, [testName]: `Error: ${error}` }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <h2>异步工具函数演示</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Button 
          onClick={() => runAsyncTest('fetchData', fetchData)}
          disabled={loading === 'fetchData'}
        >
          {loading === 'fetchData' ? 'Loading...' : '测试 fetchData'}
        </Button>
        
        <Button 
          onClick={() => runAsyncTest('fetchUserData', () => fetchUserData(1))}
          disabled={loading === 'fetchUserData'}
        >
          {loading === 'fetchUserData' ? 'Loading...' : '测试 fetchUserData'}
        </Button>
        
        <Button 
          onClick={() => runAsyncTest('apiCall', () => apiCall('/users'))}
          disabled={loading === 'apiCall'}
        >
          {loading === 'apiCall' ? 'Loading...' : '测试 apiCall'}
        </Button>
        
        <Button 
          onClick={() => runAsyncTest('verySlowFunction', verySlowFunction)}
          disabled={loading === 'verySlowFunction'}
        >
          {loading === 'verySlowFunction' ? 'Loading...' : '测试慢函数'}
        </Button>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <h4>结果：</h4>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// 使用 useCounter Hook 的组件
const CounterExample: React.FC = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>useCounter Hook 示例</h3>
      <p>Count: {count}</p>
      <button onClick={increment} style={{ margin: '5px' }}>+1</button>
      <button onClick={decrement} style={{ margin: '5px' }}>-1</button>
      <button onClick={reset} style={{ margin: '5px' }}>Reset</button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React + Vitest 示例项目</h1>
      <p>这个项目展示了所有演讲稿中提到的组件和测试示例。</p>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Button 组件</h2>
        <Button onClick={() => alert('Primary clicked!')}>Primary Button</Button>
        <span style={{ margin: '0 10px' }}></span>
        <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>Secondary Button</Button>
        <span style={{ margin: '0 10px' }}></span>
        <Button disabled>Disabled Button</Button>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Counter 组件</h2>
        <Counter initialValue={5} step={2} />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>UserList 组件</h2>
        <UserList fetchUsers={fetchUsers} />
      </div>

      <CounterExample />

      <div style={{ margin: '20px 0' }}>
        <h2>ContactForm 组件</h2>
        <ContactForm onSubmit={handleFormSubmit} />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>集成测试演示 - ContactForm + UserList</h2>
        <ContactUserIntegration />
      </div>

      <AsyncUtilsDemo />

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>运行测试</h3>
        <p>在终端中运行以下命令来测试所有组件：</p>
        <code>
          npm test # 运行所有测试<br/>
          npm run test:ui # 打开测试界面<br/>
          npm run test:coverage # 生成覆盖率报告
        </code>
      </div>
    </div>
  );
};

// 渲染应用
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root element not found');
} 