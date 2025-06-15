// // import { db } from '@/mocks/db'

import type { Category, Sort } from '@/types/transactions'

// declare global {
//   // MSW响应类型
//   interface ApiResponse<T> {
//     code: number
//     data: T
//     message?: string
//   }

//   // 分页数据类型
//   interface PaginatedData<T> {
//     list: T[]
//     total: number
//     page: number
//     size: number
//   }

//   // // 扩展Window类型
//   // interface Window {
//   //   mock: {
//   //     start: () => void;
//   //     stop: () => void;
//   //     reset: () => void;
//   //     db: typeof db;
//   //   };
//   // }
// }

// import type { AxiosRequestConfig } from 'axios'

// export interface RequestConfig extends AxiosRequestConfig {
//   /**
//    * 是否启用Mock（三态逻辑）
//    * - undefined: 自动判断
//    * - true: 强制启用
//    * - false: 强制禁用
//    */
//   mock?: boolean
// }

export interface ApiDebugConfig {
  [url: string]: {
    forceMock?: boolean
    mockData?: unknown
    delay?: number
  }
}

declare global {
  interface Window {
    __API_DEBUG__?: ApiDebugConfig
  }
}

export interface ApiResponse<T> {
  code: number
  data?: T
  message?: string
  error?: string
}

// mock数据分页参数类型，因为http url参数只能接收字符串
export interface PaginationParams {
  page: string
  pageSize: string
  sort: Sort
  category: Category
  search?: string
}
