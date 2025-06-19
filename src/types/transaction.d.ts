import { CATEGORY_TYPE_WITH_ALL } from '@/constants/categories'

export interface Transaction {
  avatar: string
  name: string
  category: string
  date: string
  amount: number
  recurring: boolean
}

export type Sort = 'latest' | 'oldest' | 'az' | 'za' | 'highest' | 'lowest'

export type Category = (typeof CATEGORY_TYPE_WITH_ALL)[number]
