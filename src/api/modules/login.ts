import http from '@/api/http'
import type { Login } from '@/types/login'

export const login = (params: Login) => {
  return http.post('/login', params)
}

export const createAccount = (params: Login) => {
  return http.post('/login/account', params)
}
