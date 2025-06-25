import { http, HttpResponse, delay } from 'msw'
import type { ApiResponse } from '@/mocks/mock'
import { apiConfig } from '@/api/config'
import type { User } from '@/types/user'
import { createAccount, login } from '@/mocks/db/login.mocks'
import type { LoginResult } from '@/types/login'

const baseURL = apiConfig.mockBaseURL

const handlers = [
  /**
   * 登录
   */
  http.post<never, User, ApiResponse<LoginResult>>(`${baseURL}/login`, async ({ request }) => {
    await delay(1)
    const params = await request.json()
    const result = await login(params)
    if (result) {
      return HttpResponse.json({ code: 200, data: result }, { status: 200 })
    } else {
      return HttpResponse.json({ code: 500 }, { status: 500 })
    }
  }),

  /**
   *  创建用户
   */
  http.post<never, User, ApiResponse<User>>(`${baseURL}/login/account`, async ({ request }) => {
    await delay(1)
    const params = await request.json()
    await createAccount(params)
    return HttpResponse.json({ code: 200 }, { status: 200 })
  }),
]

export default handlers
