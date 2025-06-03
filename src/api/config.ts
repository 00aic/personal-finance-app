interface ApiConfig {
  baseURL: string
  mockBaseURL: string
}

/**
 * 标准化URL路径（移除结尾斜杠）
 */
// const normalizeURL = (url: string): string => {
//   return url.endsWith('/') ? url.slice(0, -1) : url
// }

/**
 * 获取Mock基础路径
 */
// const getMockBaseURL = () => {
//   return (
//     import.meta.env.VITE_API_BASE_URL ||
//     (import.meta.env.BASE_URL ? `${normalizeURL(import.meta.env.BASE_URL)}` : '/')
//   )
// }

export const apiConfig: ApiConfig = {
  // baseURL: import.meta.env.VITE_API_BASE_URL || './',
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  mockBaseURL: import.meta.env.VITE_API_BASE_URL || '',
}
