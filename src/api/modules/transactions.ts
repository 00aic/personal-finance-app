import http from '@/api/http'
import type { Pagination, PaginationResponse } from '@/types/pagination'
import type { Transaction } from '@/types/transactions'

// 分页
export const getTransactionsByPage = (params: Pagination) => {
  return http.get<PaginationResponse<Transaction[]>>('/transactions', { params })
}
