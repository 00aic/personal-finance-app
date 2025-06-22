export interface RecurringBill {
  avatar: string
  name: string
  date: string
  dueDate: string
  amount: number
  status: 'paid' | 'due'
}
