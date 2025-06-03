import { http, HttpResponse, delay } from 'msw'
import type { ApiResponse } from '@/mocks/mock'
import { apiConfig } from '@/api/config'
import type { Login } from '@/types/login'
import { createAccount, login } from '@/mocks/db/login.mocks'

const baseURL = apiConfig.mockBaseURL

const handlers = [
  http.post<never, Login, ApiResponse<Login>>(`${baseURL}/login`, async ({ request }) => {
    await delay(1)
    const params = await request.json()
    const result = await login(params)
    console.log('result', result)
    if (result) {
      return HttpResponse.json({ code: 200 }, { status: 200 })
    } else {
      return HttpResponse.json({ code: 500 }, { status: 500 })
    }
  }),

  http.post<never, Login, ApiResponse<Login>>(`${baseURL}/login/account`, async ({ request }) => {
    await delay(1)
    const params = await request.json()
    await createAccount(params)
    return HttpResponse.json({ code: 200 }, { status: 200 })
  }),
]

export default handlers
