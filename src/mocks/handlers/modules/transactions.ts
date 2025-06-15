import { http, HttpResponse, delay } from 'msw'
import type { ApiResponse, PaginationParams } from '@/mocks/mock'
import { apiConfig } from '@/api/config'
import { getTransactionsByPage } from '@/mocks/db/transactions.mocks'
import type { Transaction } from '@/types/transaction'
import type { PaginationResponse } from '@/types/pagination'

const baseURL = apiConfig.mockBaseURL

const handlers = [
  // 分页
  http.get<PaginationParams, never, ApiResponse<PaginationResponse<Transaction[]>>>(
    `${baseURL}/transactions`,
    async ({ request }) => {
      await delay(1) // 模拟网络延迟

      const searchParams = new URL(request.url).searchParams
      const page = Number(searchParams.get('page'))
      const pageSize = Number(searchParams.get('pageSize'))
      const sort = searchParams.get('sort')
      const category = searchParams.get('category')
      const search = searchParams.get('search') ?? ''
      const transactions = getTransactionsByPage({ page, pageSize, sort, category, search })

      return HttpResponse.json({
        code: 200,
        data: transactions,
      })
    },
  ),
]

export default handlers
