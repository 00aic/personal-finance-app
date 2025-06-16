import { apiConfig } from '@/api/config'
import {
  deleteBudgetWithCategory,
  getBudgets,
  getBudgetsWithTransactions,
} from '@/mocks/db/budgets.mocks'
import type { ApiResponse } from '@/mocks/mock'
import type { Budget } from '@/types/budget'
import type { Category } from '@/types/transaction'
import { delay, http, HttpResponse } from 'msw'

const baseURL = apiConfig.mockBaseURL

const handlers = [
  http.get<never, never, ApiResponse<Budget[]>>(`${baseURL}/budgets`, async ({}) => {
    await delay(1) // 模拟网络延迟
    const budgets = getBudgets()
    return HttpResponse.json({
      code: 200,
      data: budgets,
    })
  }),

  http.get<never, never, ApiResponse<Budget[]>>(`${baseURL}/budgets/category`, async ({}) => {
    await delay(1) // 模拟网络延迟
    const budgets = getBudgetsWithTransactions()
    return HttpResponse.json({
      code: 200,
      data: budgets,
    })
  }),

  http.delete(`${baseURL}/budgets/:category`, async ({ params }) => {
    await delay(1)
    const category = params.category as Category
    deleteBudgetWithCategory(category)
    return HttpResponse.json({
      code: 200,
    })
  }),
]

export default handlers
