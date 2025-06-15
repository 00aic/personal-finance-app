export interface Transaction {
  avatar: string
  name: string
  category: string
  date: string
  amount: number
  recurring: boolean
}

export type Sort = 'latest' | 'oldest' | 'az' | 'za' | 'highest' | 'lowest'

export type Category =
  | 'all'
  | 'Entertainment'
  | 'Bills'
  | 'Groceries'
  | 'Dining Out'
  | 'Transportation'
  | 'Personal Care'
  | 'Education'
  | 'Lifestyle'
  | 'Shopping'
  | 'General'
