import type { Balance } from '@/types/balance'
import http from '@/api/http'

export const getBalance = () => {
  return http.get<Balance>('/balance')
}
