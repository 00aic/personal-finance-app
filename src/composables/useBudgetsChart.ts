import type { Budget } from '@/types/budget'
import type { Category } from '@/types/transaction'
import { computed, type ComputedRef, type Ref } from 'vue'

interface BudgetChartData {
  labels: Category[]
  datasets: Array<{
    data: number[]
    backgroundColor: string[]
    hoverBackgroundColor: string[]
    borderWidth: number
    cutout: string
    hoverOffset: number
  }>
}
interface UseBudgetsChartReturn {
  chartData: ComputedRef<BudgetChartData>
  chartLimit: ComputedRef<number>
  chartSpent: ComputedRef<number>
}

export function useBudgetsChart(budgets: Ref<Budget[]>): UseBudgetsChartReturn {
  const chartData = computed(() => {
    const budgetList = budgets.value
    return {
      labels: budgetList.map((item) => item.category),
      datasets: [
        {
          data: budgetList.map((item) => item.spent ?? 0),
          backgroundColor: budgetList.map((item) => item.theme),
          hoverBackgroundColor: budgetList.map((item) => `${item.theme}CC`),
          borderWidth: 0,
          cutout: '60%',
          hoverOffset: budgetList.length,
        },
      ],
    }
  })
  // 总数
  const chartLimit = computed(() => budgets.value.reduce((sum, item) => sum + item.maximum, 0))
  const chartSpent = computed(() => budgets.value.reduce((sum, item) => sum + (item.spent ?? 0), 0))
  return { chartData, chartLimit, chartSpent }
}
