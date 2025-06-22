import http from '@/api/http'
import type { Pot } from '@/types/pot'

export const getPots = () => {
  return http.get<Pot[]>('/pots')
}

export const addPot = (pot: Pot) => {
  return http.post('/pots', pot)
}

export const updatePot = (pot: Pot) => {
  return http.put('/pots', pot)
}

export const deletePotById = (name: string) => {
  return http.delete(`/pots/${name}`)
}

export const upsertPotMoney = (id: string, total: number) => {
  return http.post(`/pots/${id}`, { total })
}
