export const CATEGORY_TYPE = [
  'Entertainment',
  'Bills',
  'Groceries',
  'Dining Out',
  'Transportation',
  'Personal Care',
  'Education',
  'Lifestyle',
  'Shopping',
  'General',
] as const

export const CATEGORY_TYPE_WITH_ALL = ['all', ...CATEGORY_TYPE] as const

interface Option {
  label: string
  value: string
}

export const CATEGORY_OPTIONS: Option[] = CATEGORY_TYPE.map((category) => ({
  label: category,
  value: category,
}))

export const CATEGORY_OPTIONS_WITH_ALL: Option[] = [
  {
    label: 'All Transactions',
    value: 'all',
  },
  ...CATEGORY_OPTIONS,
]
