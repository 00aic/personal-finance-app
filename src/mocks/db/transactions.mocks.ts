import type { Pagination, PaginationResponse } from '@/types/pagination'
import type { Category, Sort, Transaction } from '@/types/transaction'
import { useLocalStorage } from '@vueuse/core'

// 原始数据
const originTransactions: Transaction[] = [
  {
    avatar: 'emma-richardson.jpg',
    name: 'Emma Richardson',
    category: 'General',
    date: '2025-06-19T14:23:11Z',
    amount: 75.5,
    recurring: false,
  },
  {
    avatar: 'savory-bites-bistro.jpg',
    name: 'Savory Bites Bistro',
    category: 'Dining Out',
    date: '2025-06-19T20:23:11Z',
    amount: -55.5,
    recurring: false,
  },
  {
    avatar: 'daniel-carter.jpg',
    name: 'Daniel Carter',
    category: 'General',
    date: '2025-06-18T09:45:32Z',
    amount: -42.3,
    recurring: false,
  },
  {
    avatar: 'sun-park.jpg',
    name: 'Sun Park',
    category: 'General',
    date: '2025-06-17T16:12:05Z',
    amount: 120.0,
    recurring: false,
  },
  {
    avatar: 'urban-services-hub.jpg',
    name: 'Urban Services Hub',
    category: 'General',
    date: '2025-06-17T21:08:09Z',
    amount: -65.0,
    recurring: false,
  },
  {
    avatar: 'liam-hughes.jpg',
    name: 'Liam Hughes',
    category: 'Groceries',
    date: '2025-06-15T18:20:33Z',
    amount: 65.75,
    recurring: false,
  },
  {
    avatar: 'lily-ramirez.jpg',
    name: 'Lily Ramirez',
    category: 'General',
    date: '2025-06-14T13:05:27Z',
    amount: 50.0,
    recurring: false,
  },
  {
    avatar: 'ethan-clark.jpg',
    name: 'Ethan Clark',
    category: 'Dining Out',
    date: '2025-06-13T20:15:59Z',
    amount: -32.5,
    recurring: false,
  },
  {
    avatar: 'james-thompson.jpg',
    name: 'James Thompson',
    category: 'Entertainment',
    date: '2025-06-11T15:45:38Z',
    amount: -5.0,
    recurring: false,
  },
  {
    avatar: 'pixel-playground.jpg',
    name: 'Pixel Playground',
    category: 'Entertainment',
    date: '2025-06-11T18:45:38Z',
    amount: -10.0,
    recurring: true,
  },
  {
    avatar: 'ella-phillips.jpg',
    name: 'Ella Phillips',
    category: 'Dining Out',
    date: '2025-06-10T19:22:51Z',
    amount: -45.0,
    recurring: false,
  },
  {
    avatar: 'sofia-peterson.jpg',
    name: 'Sofia Peterson',
    category: 'Transportation',
    date: '2025-06-08T08:55:17Z',
    amount: -15.0,
    recurring: false,
  },
  {
    avatar: 'mason-martinez.jpg',
    name: 'Mason Martinez',
    category: 'Lifestyle',
    date: '2025-06-07T17:40:29Z',
    amount: -35.25,
    recurring: false,
  },
  {
    avatar: 'green-plate-eatery.jpg',
    name: 'Green Plate Eatery',
    category: 'Groceries',
    date: '2025-06-06T08:25:44Z',
    amount: -78.5,
    recurring: false,
  },
  {
    avatar: 'sebastian-cook.jpg',
    name: 'Sebastian Cook',
    category: 'Transportation',
    date: '2025-06-06T10:05:44Z',
    amount: -22.5,
    recurring: false,
  },
  {
    avatar: 'william-harris.jpg',
    name: 'William Harris',
    category: 'Personal Care',
    date: '2025-06-05T14:30:56Z',
    amount: -10.0,
    recurring: false,
  },
  {
    avatar: 'elevate-education.jpg',
    name: 'Elevate Education',
    category: 'Education',
    date: '2025-06-04T11:15:22Z',
    amount: -50.0,
    recurring: true,
  },
  {
    avatar: 'serenity-spa-and-wellness.jpg',
    name: 'Serenity Spa & Wellness',
    category: 'Personal Care',
    date: '2025-06-03T14:00:37Z',
    amount: -30.0,
    recurring: true,
  },
  {
    avatar: 'spark-electric-solutions.jpg',
    name: 'Spark Electric Solutions',
    category: 'Bills',
    date: '2025-06-02T09:25:11Z',
    amount: -100.0,
    recurring: true,
  },
  {
    avatar: 'rina-sato.jpg',
    name: 'Rina Sato',
    category: 'Bills',
    date: '2025-06-02T13:31:11Z',
    amount: -50.0,
    recurring: false,
  },
  {
    avatar: 'swift-ride-share.jpg',
    name: 'Swift Ride Share',
    category: 'Transportation',
    date: '2025-06-01T18:40:33Z',
    amount: -18.75,
    recurring: false,
  },
  {
    avatar: 'aqua-flow-utilities.jpg',
    name: 'Aqua Flow Utilities',
    category: 'Bills',
    date: '2024-07-30T13:20:14Z',
    amount: -100.0,
    recurring: true,
  },
  {
    avatar: 'ecofuel-energy.jpg',
    name: 'EcoFuel Energy',
    category: 'Bills',
    date: '2024-07-29T11:55:29Z',
    amount: -35.0,
    recurring: true,
  },
  {
    avatar: 'yuna-kim.jpg',
    name: 'Yuna Kim',
    category: 'Dining Out',
    date: '2024-07-29T13:51:29Z',
    amount: -28.5,
    recurring: false,
  },
  {
    avatar: 'flavor-fiesta.jpg',
    name: 'Flavor Fiesta',
    category: 'Dining Out',
    date: '2024-07-27T20:15:06Z',
    amount: -42.75,
    recurring: false,
  },
  {
    avatar: 'harper-edwards.jpg',
    name: 'Harper Edwards',
    category: 'Shopping',
    date: '2024-07-26T09:43:23Z',
    amount: -89.99,
    recurring: false,
  },
  {
    avatar: 'buzz-marketing-group.jpg',
    name: 'Buzz Marketing Group',
    category: 'General',
    date: '2024-07-26T14:40:23Z',
    amount: 3358.0,
    recurring: false,
  },
  {
    avatar: 'technova-innovations.jpg',
    name: 'TechNova Innovations',
    category: 'Shopping',
    date: '2024-07-25T16:25:37Z',
    amount: -29.99,
    recurring: false,
  },
  {
    avatar: 'bytewise.jpg',
    name: 'ByteWise',
    category: 'Lifestyle',
    date: '2024-07-23T09:35:14Z',
    amount: -49.99,
    recurring: true,
  },
  {
    avatar: 'nimbus-data-storage.jpg',
    name: 'Nimbus Data Storage',
    category: 'Bills',
    date: '2024-07-21T10:05:42Z',
    amount: -9.99,
    recurring: true,
  },
  {
    avatar: 'emma-richardson.jpg',
    name: 'Emma Richardson',
    category: 'General',
    date: '2024-07-20T17:30:55Z',
    amount: -25.0,
    recurring: false,
  },
  {
    avatar: 'daniel-carter.jpg',
    name: 'Daniel Carter',
    category: 'General',
    date: '2024-07-19T12:45:09Z',
    amount: 50.0,
    recurring: false,
  },
  {
    avatar: 'sun-park.jpg',
    name: 'Sun Park',
    category: 'General',
    date: '2024-07-18T19:20:23Z',
    amount: -38.5,
    recurring: false,
  },
  {
    avatar: 'harper-edwards.jpg',
    name: 'Harper Edwards',
    category: 'Shopping',
    date: '2024-07-17T14:55:37Z',
    amount: -29.99,
    recurring: false,
  },
  {
    avatar: 'liam-hughes.jpg',
    name: 'Liam Hughes',
    category: 'Groceries',
    date: '2024-07-16T10:10:51Z',
    amount: -52.75,
    recurring: false,
  },
  {
    avatar: 'lily-ramirez.jpg',
    name: 'Lily Ramirez',
    category: 'General',
    date: '2024-07-15T16:35:04Z',
    amount: 75.0,
    recurring: false,
  },
  {
    avatar: 'ethan-clark.jpg',
    name: 'Ethan Clark',
    category: 'Dining Out',
    date: '2024-07-14T20:50:18Z',
    amount: -41.25,
    recurring: false,
  },
  {
    avatar: 'rina-sato.jpg',
    name: 'Rina Sato',
    category: 'Entertainment',
    date: '2024-07-13T09:15:32Z',
    amount: -10.0,
    recurring: false,
  },
  {
    avatar: 'james-thompson.jpg',
    name: 'James Thompson',
    category: 'Bills',
    date: '2024-07-12T13:40:46Z',
    amount: -95.5,
    recurring: false,
  },
  {
    avatar: 'ella-phillips.jpg',
    name: 'Ella Phillips',
    category: 'Dining Out',
    date: '2024-07-11T18:05:59Z',
    amount: -33.75,
    recurring: false,
  },
  {
    avatar: 'yuna-kim.jpg',
    name: 'Yuna Kim',
    category: 'Dining Out',
    date: '2024-07-10T12:30:13Z',
    amount: -27.5,
    recurring: false,
  },
  {
    avatar: 'sofia-peterson.jpg',
    name: 'Sofia Peterson',
    category: 'Transportation',
    date: '2024-07-09T08:55:27Z',
    amount: -12.5,
    recurring: false,
  },
  {
    avatar: 'mason-martinez.jpg',
    name: 'Mason Martinez',
    category: 'Lifestyle',
    date: '2024-07-08T15:20:41Z',
    amount: -65.0,
    recurring: false,
  },
  {
    avatar: 'sebastian-cook.jpg',
    name: 'Sebastian Cook',
    category: 'Transportation',
    date: '2024-07-07T11:45:55Z',
    amount: -20.0,
    recurring: false,
  },
  {
    avatar: 'william-harris.jpg',
    name: 'William Harris',
    category: 'General',
    date: '2024-07-06T17:10:09Z',
    amount: 20.0,
    recurring: false,
  },
  {
    avatar: 'elevate-education.jpg',
    name: 'Elevate Education',
    category: 'Education',
    date: '2024-07-05T11:15:22Z',
    amount: -50.0,
    recurring: true,
  },
  {
    avatar: 'serenity-spa-and-wellness.jpg',
    name: 'Serenity Spa & Wellness',
    category: 'Personal Care',
    date: '2024-07-03T14:00:37Z',
    amount: -30.0,
    recurring: true,
  },
  {
    avatar: 'spark-electric-solutions.jpg',
    name: 'Spark Electric Solutions',
    category: 'Bills',
    date: '2024-07-02T09:25:51Z',
    amount: -100.0,
    recurring: true,
  },
  {
    avatar: 'swift-ride-share.jpg',
    name: 'Swift Ride Share',
    category: 'Transportation',
    date: '2024-07-02T19:50:05Z',
    amount: -16.5,
    recurring: false,
  },
]
// 缓存数据
const transactions = useLocalStorage<Transaction[]>('transactions', originTransactions)

// 分页
const paginate = (pagination: Pagination): Transaction[] => {
  const { page, pageSize, sort, category, search } = pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize
  getTransactionsBySortAndCategory(sort, category)
  getTransactionsBySearch(search)
  return transactions.value.slice(start, end)
}

// 获取所有交易数据
export const getAllTransactions = () => {
  return originTransactions
}
// 根据类别获取最近的三笔交易数据
export const getLatestTransactionsByCategory = (category: Category) => {
  getTransactionsBySortAndCategory('latest', category)
  return transactions.value.slice(0, 3)
}

// 分页获取数据
export const getTransactionsByPage = (
  pagination: Pagination,
): PaginationResponse<Transaction[]> => {
  const data = paginate(pagination)
  return { total: transactions.value.length, data }
}

// 按排序、category分类获取数据
export const getTransactionsBySortAndCategory = (sort: Sort, category: Category): void => {
  transactions.value = originTransactions
  transactions.value.sort((a, b) => {
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
  if ('all' !== category) {
    transactions.value = transactions.value.filter((item) => item.category === category)
  }
}

// 按搜索名称获取数据
export const getTransactionsBySearch = (searchParams: string | undefined | null) => {
  if (!searchParams) return
  transactions.value = transactions.value.filter((item) =>
    item.name.toLocaleLowerCase().includes(searchParams.toLocaleLowerCase()),
  )
}
