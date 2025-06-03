import { apiConfig } from '@/api/config'
import axios, { type AxiosRequestConfig, type AxiosStatic } from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * 是否启用Mock（三态逻辑）
     * - undefined: 自动判断
     * - true: 强制启用
     * - false: 强制禁用
     */
    mock?: boolean
  }
}

const _axios: AxiosStatic = axios

const getMockStatus = (config: AxiosRequestConfig): boolean => {
  // if (import.meta.env.PROD) return false

  // 显式配置优先
  if (typeof config.mock === 'boolean') return config.mock

  // 动态调试配置
  const url = config.url ?? ''
  const debugConfig = window.__API_DEBUG__ || {}

  if (debugConfig[url]?.forceMock !== undefined) {
    return debugConfig[url]!.forceMock!
  }

  // 环境变量回退
  return import.meta.env.VITE_MOCK_ENABLED === 'true'
}

const http = _axios.create({
  baseURL: apiConfig.baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use((config) => {
  if (getMockStatus(config)) {
    config.headers['X-Mock-Request'] = 'true'
    // config.adapter = config.adapter || mockAdapter // 可以自定义Mock适配器
  }
  return config
})

// 响应拦截器
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 统一错误处理
    return Promise.reject({
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
    })
  },
)

export default http
