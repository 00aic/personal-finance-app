import { http, passthrough } from 'msw'

// 全局前置拦截器
const globalRequestInterceptor = http.all('*', async ({ request }) => {
  if (!shouldMock(request)) {
    return passthrough()
  }
  // 明确返回undefined表示继续执行后续handler
  return undefined
})

// 判断逻辑（可提取到单独文件）
function shouldMock(req: Request) {
  // if (import.meta.env.PROD) return false

  return (
    req.headers.get('X-Mock-Request') === 'true' ||
    window.__API_DEBUG__?.[new URL(req.url).pathname]?.forceMock
  )
}

export default globalRequestInterceptor
