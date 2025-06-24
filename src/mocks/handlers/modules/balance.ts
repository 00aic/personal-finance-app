import { apiConfig } from '@/api/config'
import { getBalance } from '@/mocks/db/balance.mocks'
import type { ApiResponse } from '@/mocks/mock'
import type { Balance } from '@/types/balance'
import { delay, http, HttpResponse } from 'msw'

const baseURL = apiConfig.mockBaseURL

const handlers = [
  http.get<never, never, ApiResponse<Balance>>(`${baseURL}/balance`, async ({}) => {
    await delay(1) // 模拟网络延迟
    const balance = getBalance()
    return HttpResponse.json({
      code: 200,
      data: balance,
    })
  }),
]

export default handlers
