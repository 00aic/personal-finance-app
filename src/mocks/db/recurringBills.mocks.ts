import type { RecurringBill } from '@/types/RecurringBill'
import { getAllTransactions } from './transactions.mocks'
import type { Sort } from '@/types/transaction'

const getDueDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const day = date.getDate()
  const suffix = (day: number) => {
    if (day > 3 && day < 21) {
      return 'th'
    }
    switch (day % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'

      default:
        return 'th'
    }
  }
  return `Monthly-${day}${suffix(day)}`
}

export const getRecurringBills = (): RecurringBill[] => {
  const transactions = getAllTransactions()
  const recurringTransactions = transactions.filter((item) => item.recurring)
  const mergeRecurringTransactions = new Map<string, RecurringBill>()
  recurringTransactions.forEach((item) => {
    const billItem: RecurringBill = {
      avatar: item.avatar,
      name: item.name,
      date: item.date,
      dueDate: getDueDate(item.date),
      amount: item.amount >= 0 ? item.amount : -item.amount,
      status: item.amount >= 0 ? 'paid' : 'due',
    }
    if (!mergeRecurringTransactions.has(item.name)) {
      mergeRecurringTransactions.set(item.name, billItem)
    } else {
      const existingBill = mergeRecurringTransactions.get(item.name)
      if (existingBill && new Date(item.date).getTime() > new Date(existingBill.date).getTime()) {
        billItem.date = existingBill.date
        mergeRecurringTransactions.set(item.name, billItem)
      }
    }
  })
  return Array.from(mergeRecurringTransactions.values())
}

export const getRecurringBillsByName = (name: string): RecurringBill[] => {
  return getRecurringBills().filter((item) =>
    item.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
  )
}

export const getRecurringBillsBySort = (sort: Sort): RecurringBill[] => {
  return getRecurringBills().sort((a, b) => {
    let compare = 0
    switch (sort) {
      case 'latest': // 最新(最近)
        compare = new Date(b.date).getTime() - new Date(a.date).getTime()
        break
      case 'oldest': // 最旧
        compare = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'az': // A-Z
        compare = a.name.localeCompare(b.name)
        break
      case 'za': // Z-A
        compare = b.name.localeCompare(a.name)
        break
      case 'highest': // 最高
        compare = b.amount - a.amount
        break
      case 'lowest': // 最低
        compare = a.amount - b.amount
        break
      default:
        break
    }
    return compare
  })
}
