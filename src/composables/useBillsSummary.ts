import type { RecurringBill } from '@/types/recurringBill'
import { computed, type ComputedRef, type Ref } from 'vue'

interface BillsSummary {
  totalBills: number
  paidBillsNumber: number
  paidBillsAmount: number
  dueBillsNumber: number
  dueBillsAmount: number
  dueBillsLastFiveNumber: number
  dueBillsLastFiveAmount: number
}

function isWithLastFiveDays(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const fiveDaysAgo = new Date(now.getDate() - 5)
  return date >= fiveDaysAgo && date <= now
}

export function useBillsSummary(recurringBills: Ref<RecurringBill[]>): ComputedRef<BillsSummary> {
  return computed(() => {
    return recurringBills.value.reduce((acc, bill) => {
      acc['totalBills'] = (acc['totalBills'] ?? 0) + Number(bill.amount)
      if (bill.status === 'paid') {
        acc['paidBillsNumber'] = (acc['paidBillsNumber'] ?? 0) + 1
        acc['paidBillsAmount'] = (acc['paidBillsAmount'] ?? 0) + Number(bill.amount)
      }
      if (bill.status === 'due') {
        acc['dueBillsNumber'] = (acc['dueBillsNumber'] ?? 0) + 1
        acc['dueBillsAmount'] = (acc['dueBillsAmount'] ?? 0) + Number(bill.amount)
        if (isWithLastFiveDays(bill.date)) {
          acc['dueBillsLastFiveNumber'] = (acc['dueBillsLastFiveNumber'] ?? 0) + 1
          acc['dueBillsLastFiveAmount'] = (acc['dueBillsLastFiveAmount'] ?? 0) + Number(bill.amount)
        }
      }

      return acc
    }, {} as BillsSummary)
  })
}
