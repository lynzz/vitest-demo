import '@testing-library/jest-dom'

// 可以在这里添加全局的测试设置
// 例如：模拟全局对象、设置测试环境变量等

// 模拟 console.error 避免测试中的警告影响输出
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
}) 