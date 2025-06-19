import type { Category, Transaction } from '@/types/transaction'

export interface Budget {
  category: Category
  maximum: number
  theme: string
  spent?: number
  transactions?: Transaction[]
  remaining?: number
}
