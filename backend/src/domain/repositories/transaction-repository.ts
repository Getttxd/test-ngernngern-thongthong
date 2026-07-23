import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from '../entities/transaction'

export interface TransactionRepository {
  findAll(): Promise<Transaction[]>
  findById(id: string): Promise<Transaction | null>
  findByType(type: 'income' | 'expense'): Promise<Transaction[]>
  findByCategory(categoryId: string): Promise<Transaction[]>
  findByDateRange(from: string, to: string): Promise<Transaction[]>
  create(input: CreateTransactionInput): Promise<Transaction>
  update(id: string, input: UpdateTransactionInput): Promise<Transaction | null>
  delete(id: string): Promise<boolean>
}
