# React + Vitest 单元测试演示项目

这是一个配套 Slidev 演讲稿的 React + Vitest 单元测试示例项目，从基础概念到实际应用的完整演练。

## 📚 项目概述

本项目包含了演讲稿中提到的所有示例代码，展示了如何在 React 项目中使用 Vitest 进行单元测试：

### 🎯 第一部分：Unit Test 基础
- 单元测试概念和 AAA 模式
- 测试金字塔和最佳实践

### ⚡ 第二部分：Vitest 介绍
- 现代化测试框架特性
- 与 Jest 的对比优势

### 🚀 第三部分：实战示例（循序渐进）
1. **纯函数测试** - `src/utils/math.ts`
2. **React 组件测试** - `src/components/Button.tsx`
3. **状态组件测试** - `src/components/Counter.tsx`
4. **异步操作测试** - `src/components/UserList.tsx`
5. **自定义 Hook 测试** - `src/hooks/useCounter.ts`
6. **集成测试** - `src/components/ContactForm.tsx`

## 🛠 技术栈

- **React 18** - 用户界面框架
- **TypeScript** - 类型安全
- **Vitest** - 测试框架
- **@testing-library/react** - React 组件测试工具
- **happy-dom** - DOM 模拟环境
- **Slidev** - 演讲稿制作工具

### 为什么选择 happy-dom？

相比传统的 jsdom，happy-dom 具有以下优势：

- 🚀 **更快的性能** - 启动速度比 jsdom 快 3-5 倍
- 💾 **更低的内存占用** - 内存使用量减少约 50%
- 🔧 **更好的兼容性** - 对现代 Web API 支持更完善
- ⚡ **更快的测试执行** - DOM 操作性能显著提升

```bash
# 性能对比示例
# jsdom: ~800ms 启动时间，~150MB 内存
# happy-dom: ~200ms 启动时间，~75MB 内存
```

## 📦 安装和运行

### 安装依赖
```bash
pnpm install
# 或
npm install

# 如果需要单独安装测试依赖
pnpm add -D vitest @vitest/ui happy-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 运行演讲稿
```bash
pnpm dev
# 或
npm run dev
```

### 运行测试
```bash
# 运行所有测试（watch 模式）
pnpm test

# 运行测试一次
pnpm run test:run

# 打开测试 UI 界面
pnpm run test:ui

# 生成测试覆盖率报告
pnpm run test:coverage
```

### 构建演讲稿
```bash
pnpm build
# 或
npm run build
```

## 📁 项目结构

```
vitest-demo/
├── src/
│   ├── components/          # React 组件
│   │   ├── Button.tsx      # 基础按钮组件
│   │   ├── Counter.tsx     # 计数器组件
│   │   ├── UserList.tsx    # 用户列表组件
│   │   ├── ContactForm.tsx # 联系表单组件
│   │   └── __tests__/      # 组件测试文件
│   ├── hooks/              # 自定义 Hook
│   │   ├── useCounter.ts   # 计数器 Hook
│   │   └── __tests__/      # Hook 测试文件
│   ├── utils/              # 工具函数
│   │   ├── math.ts         # 数学工具函数
│   │   └── __tests__/      # 工具函数测试
│   ├── test/
│   │   └── setup.ts        # 测试环境设置
│   └── index.tsx           # React 应用入口
├── slides.md               # Slidev 演讲稿
├── vitest.config.ts        # Vitest 配置
├── tsconfig.json           # TypeScript 配置
├── index.html              # HTML 模板
└── package.json            # 项目配置
```

## 🧪 测试示例

### 1. 纯函数测试
```typescript
// src/utils/__tests__/math.test.ts
test('should add two numbers', () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});
```

### 2. React 组件测试
```typescript
// src/components/__tests__/Button.test.tsx
test('calls onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 3. 异步操作测试
```typescript
// src/components/__tests__/UserList.test.tsx
test('displays users after successful fetch', async () => {
  const fetchUsers = vi.fn().mockResolvedValue(mockUsers);
  render(<UserList fetchUsers={fetchUsers} />);
  
  await waitFor(() => {
    expect(screen.getByText('John - john@test.com'))
      .toBeInTheDocument();
  });
});
```

### 4. 自定义 Hook 测试
```typescript
// src/hooks/__tests__/useCounter.test.ts
test('increments count', () => {
  const { result } = renderHook(() => useCounter(0));
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## 🎯 学习目标

通过这个项目，你将学会：

- ✅ 理解单元测试的基本概念和重要性
- ✅ 掌握 Vitest 的配置和使用方法  
- ✅ 学会测试 React 组件的各种场景
- ✅ 掌握异步操作和用户交互的测试方法
- ✅ 了解测试驱动开发（TDD）的实践
- ✅ 学会编写可维护的测试代码

## 📊 测试覆盖率

运行 `pnpm run test:coverage` 查看详细的测试覆盖率报告。

目标覆盖率：
- **语句覆盖率**: > 90%
- **分支覆盖率**: > 85%
- **函数覆盖率**: > 90%
- **行覆盖率**: > 90%

## 🎓 最佳实践

1. **遵循 F.I.R.S.T 原则** - 快速、独立、可重复、自验证、及时
2. **使用 AAA 模式** - Arrange、Act、Assert
3. **测试行为而非实现** - 关注用户可见的行为
4. **适当使用 Mock** - 模拟外部依赖
5. **保持测试简单** - 一个测试只验证一个功能点
6. **清晰的测试命名** - 描述测试的期望行为

## 🔗 相关资源

- [Vitest 官方文档](https://vitest.dev)
- [Testing Library 文档](https://testing-library.com)
- [React 测试最佳实践](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Slidev 文档](https://sli.dev)

## 🎓 许可证

MIT License
