export interface PaginationResponse<T> {
  total: number
  data: T
}

export interface Pagination {
  page: number
  pageSize: number
  sort: Sort
  category: Category
  search?: string
}
