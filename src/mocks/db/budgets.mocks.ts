import type { Budget } from '@/types/budget'
import { useLocalStorage } from '@vueuse/core'
import { getAllTransactions, getLatestTransactionsByCategory } from './transactions.mocks'
import type { Category } from '@/types/transaction'

const originBudgets: Budget[] = [
  {
    category: 'Entertainment',
    maximum: 50.0,
    theme: '#277C78',
  },
  {
    category: 'Bills',
    maximum: 750.0,
    theme: '#82C9D7',
  },
  {
    category: 'Dining Out',
    maximum: 75.0,
    theme: '#F2CDAC',
  },
  {
    category: 'Personal Care',
    maximum: 100.0,
    theme: '#626070',
  },
]
const budgets = useLocalStorage<Budget[]>('budgets', originBudgets)

// 判断是否为当月
const isCurrentMonth = (date: string) => {
  const inputDate = new Date(date)
  const now = new Date()
  return inputDate.getFullYear === now.getFullYear && inputDate.getMonth === now.getMonth
}
export const getBudgets = (): Budget[] => {
  const transactions = getAllTransactions()
  const categoryAmount = transactions.reduce(
    (acc, transaction) => {
      const { category, amount, date, recurring } = transaction
      if (isCurrentMonth(date) && !recurring) {
        // 只获取当月的已花费
        acc[category] = (acc[category] || 0) - amount
      }

      return acc
    },
    {} as Record<string, number>,
  )
  const budgetsWithSpent = budgets.value.map((item) => ({
    ...item,
    spent: categoryAmount[item.category],
  }))
  return budgetsWithSpent
}

export const getBudgetsWithTransactions = () => {
  const budgetsWithSpent = getBudgets()
  return budgetsWithSpent.map((item) => ({
    ...item,
    transactions: getLatestTransactionsByCategory(item.category),
  }))
}

export const deleteBudgetWithCategory = (category: Category) => {
  budgets.value = budgets.value.filter((item) => item.category !== category)
}
