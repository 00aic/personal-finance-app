import { apiConfig } from '@/api/config'
import { addPot, deletePotById, getPots, updatePot, upsertPotMoney } from '@/mocks/db/pots.mocks'
import type { ApiResponse } from '@/mocks/mock'
import type { Pot } from '@/types/pot'
import { delay, http, HttpResponse } from 'msw'

const baseURL = apiConfig.mockBaseURL

const handlers = [
  http.get<never, never, ApiResponse<Pot[]>>(`${baseURL}/pots`, async ({}) => {
    await delay(1)
    const pots = getPots()
    return HttpResponse.json({
      code: 200,
      data: pots,
    })
  }),
  http.post<never, Pot, ApiResponse<void>>(`${baseURL}/pots`, async ({ request }) => {
    await delay(1)
    const pot = await request.json()
    addPot(pot)
    return HttpResponse.json({
      code: 200,
    })
  }),

  http.put<never, Pot, ApiResponse<void>>(`${baseURL}/pots`, async ({ request }) => {
    await delay(1)
    const pot = await request.json()
    updatePot(pot)
    return HttpResponse.json({
      code: 200,
    })
  }),

  http.delete<{ name: string }>(`${baseURL}/pots/:name`, async ({ params }) => {
    await delay(1)
    const name = params.name
    deletePotById(name)
    return HttpResponse.json({
      code: 200,
    })
  }),
  http.post<{ id: string }, { total: number }, ApiResponse<void>>(
    `${baseURL}/pots/:id`,
    async ({ params, request }) => {
      await delay(1)
      const id = params.id
      const body = await request.json()
      upsertPotMoney(id, body.total)
      return HttpResponse.json({
        code: 200,
      })
    },
  ),
]

export default handlers
