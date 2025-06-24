import type { Balance } from '@/types/balance'

const balance = {
  current: 4836.0,
  income: 3814.25,
  expenses: 1700.5,
}

export const getBalance = (): Balance => {
  return balance
}
