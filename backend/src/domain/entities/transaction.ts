export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  description?: string
  date: string
  createdAt: string
}

export interface CreateTransactionInput {
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  description?: string
  date: string
}

export interface UpdateTransactionInput {
  amount?: number
  type?: 'income' | 'expense'
  categoryId?: string
  description?: string
  date?: string
}

export interface TransactionFilter {
  type?: 'income' | 'expense'
  categoryId?: string
  dateFrom?: string
  dateTo?: string
}
