import type { Budget } from '@/types/budget'
import http from '@/api/http'

export const getBudgets = () => {
  return http.get<Budget[]>('/budgets')
}

export const getBudgetsWithTransactions = () => {
  return http.get<Budget[]>('/budgets/category')
}
