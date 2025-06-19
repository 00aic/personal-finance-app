import type { Budget } from '@/types/budget'
import http from '@/api/http'
import type { Category } from '@/types/transaction'

export const getBudgets = () => {
  return http.get<Budget[]>('/budgets')
}

export const getBudgetsWithTransactions = () => {
  return http.get<Budget[]>('/budgets/category')
}

export const deleteBudgetWithCategory = (category: Category) => {
  return http.delete(`/budgets/${category}`)
}

export const addBudget = (budget: Budget) => {
  return http.post(`/budgets`, budget)
}

export const updateBudget = (budget: Budget) => {
  return http.put(`/budgets`, budget)
}
