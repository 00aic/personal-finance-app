import { apiConfig } from '@/api/config'
import {
  getRecurringBills,
  getRecurringBillsByName,
  getRecurringBillsBySort,
} from '@/mocks/db/recurringBills.mocks'
import type { ApiResponse } from '@/mocks/mock'
import type { RecurringBill } from '@/types/recurringBill'
import type { Sort } from '@/types/transaction'
import { delay, http, HttpResponse } from 'msw'

const baseURL = apiConfig.mockBaseURL

const handlers = [
  http.get<never, never, ApiResponse<RecurringBill[]>>(`${baseURL}/recurringBills`, async ({}) => {
    await delay(1)
    const recurringBills = getRecurringBills()
    return HttpResponse.json({
      code: 200,
      data: recurringBills,
    })
  }),

  http.get<{ name: string }, never, ApiResponse<RecurringBill[]>>(
    `${baseURL}/recurringBills/:name`,
    async ({ params }) => {
      await delay(1)
      const recurringBills = getRecurringBillsByName(params.name)
      return HttpResponse.json({
        code: 200,
        data: recurringBills,
      })
    },
  ),

  http.get<{ sort: Sort }, never, ApiResponse<RecurringBill[]>>(
    `${baseURL}/recurringBills/sort/:sort`,
    async ({ params }) => {
      await delay(1)
      const recurringBills = getRecurringBillsBySort(params.sort)
      return HttpResponse.json({
        code: 200,
        data: recurringBills,
      })
    },
  ),
]

export default handlers
