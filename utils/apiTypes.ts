export type ApiCard = {
  id:number
  name: string,
  card_sets: string[]
}

export type ApiPurchase  = {
  id: string
  name: string
  startDate: string
  endDate: string
  updatedAt: string
}

export type Pagination<T> = {
  page: number
  total: number
  data: T[]
}