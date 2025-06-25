import http from '@/api/http'
import type { LoginResult } from '@/types/login'
import type { User } from '@/types/user'

export const login = (params: User) => {
  return http.post<LoginResult>('/login', params)
}

export const createAccount = (params: User) => {
  return http.post('/login/account', params)
}
