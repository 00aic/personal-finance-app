安装依赖

```typescript
npm i -D @faker-js/faker msw
```

```typescript
npx msw init <PUBLIC_DIR> --save
npx msw init public --save
```

场景案例：混合模式开发
假设您的项目中有：

80% 的接口已经完成，使用真实 API

20% 的接口后端尚未开发，需要 Mock

此时可以：

```typescript
// 已完成的接口（走真实API）
api.get('/real-api', { mock: false })

// 未完成的接口（强制Mock）
api.get('/mock-api', { mock: true })
```

可以通过在env.development文件和env.production文件配置是否整体启用mock：

```typescript
VITE_MOCK_ENABLED = true
```

动态调试需求
在 Chrome DevTools 中快速切换单个接口的 Mock 状态：

```typescript
// 控制台临时禁用某个接口的Mock
window.__API_DEBUG__ = {
  '/api/users': { forceMock: false },
}
```

\*\*使用场景示例
场景1：全局关闭Mock，但特定接口启用

```typescript
// .env.development
VITE_MOCK_ENABLED = false

// 组件中
api.get('/api/users', { mock: true }) // 强制Mock
api.get('/api/posts') // 走真实API
```

场景2：动态调试

```typescript
// 浏览器控制台
window.__API_DEBUG__ = {
  '/api/users': { forceMock: true },
  '/api/posts': { forceMock: false },
}
// 不需要刷新页面，立即生效
```

场景3：测试用例

```typescript
// 测试用例1：验证Mock数据
test('fetch mock users', async () => {
  const res = await api.get('/api/users', { mock: true })
  expect(res).toMatchSnapshot()
})

// 测试用例2：测试真实API
test('fetch real users', async () => {
  const res = await api.get('/api/users', { mock: false })
  expect(res.data).toHaveProperty('list')
})
```

\*\*架构优势
灵活性：从全局到请求的细粒度控制

可调试性：无需重启即可动态调整

类型安全：完整的 TypeScript 支持

平滑过渡：从 Mock 到真实 API 无需修改业务代码

测试友好：便于编写不同场景的测试用例

这种设计虽然增加了少量配置复杂度，但为项目后期维护和团队协作带来了显著便利，特别适合中大型项目的开发需求。

如何使用调试系统
控制台操作：

```typescript
// 启用某个接口的Mock
window.__API_DEBUG__ = {
  '/api/users': { forceMock: true },
}

// 禁用Mock
window.__API_DEBUG__['/api/users'].forceMock = false
```

添加模拟数据：

```typescript
window.__API_DEBUG__ = {
  '/api/products': {
    forceMock: true,
    mockData: [{ id: 1, name: '测试商品' }],
  },
}
```

模拟延迟：

```typescript
window.__API_DEBUG__ = {
  '/api/orders': {
    forceMock: true,
    delay: 1000, // 1秒延迟
  },
}
```

构建时，vite.config.js配置？？？？

```typescript
// 构建时排除Mock代码
// build: {
//   rollupOptions: {
//     external: ['msw'],
//   },
// },
```
