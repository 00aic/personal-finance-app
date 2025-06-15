import http from '@/api/http'
import type { Pagination, PaginationResponse } from '@/types/pagination'
import type { Transaction } from '@/types/transaction'

// 分页
export const getTransactionsByPage = (params: Pagination) => {
  return http.get<PaginationResponse<Transaction[]>>('/transactions', { params })
}
