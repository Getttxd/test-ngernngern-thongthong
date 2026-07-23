export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  description?: string
  date: string
  createdAt: string
}

export interface CreateTransactionBody {
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  description?: string
  date: string
}

export interface UpdateTransactionBody {
  amount?: number
  type?: 'income' | 'expense'
  categoryId?: string
  description?: string
  date?: string
}

export interface TransactionListResponse {
  data: Transaction[]
}

export interface TransactionResponse {
  data: Transaction
}
