import type { RecurringBill } from '@/types/recurringBill'
import http from '@/api/http'
import type { Sort } from '@/types/transaction'

export const getRecurringBills = () => {
  return http.get<RecurringBill[]>('/recurringBills')
}

export const getRecurringBillsByName = (name: string) => {
  return http.get<RecurringBill[]>(`/recurringBills/${name}`)
}

export const getRecurringBillsBySort = (sort: Sort) => {
  return http.get<RecurringBill[]>(`/recurringBills/sort/${sort}`)
}
