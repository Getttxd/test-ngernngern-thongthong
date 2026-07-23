import type { CreateTransactionInput, UpdateTransactionInput, Transaction } from '../domain/entities/transaction'
import { NotFoundError, ValidationError } from '../domain/errors'
import type { TransactionRepository } from '../domain/repositories/transaction-repository'

const VALID_TYPES = ['income', 'expense'] as const

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository
  ) {}

  async listTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.findAll()
  }

  async getTransaction(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id)
    if (!transaction) throw new NotFoundError('Transaction')
    return transaction
  }

  async listByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    this.validateType(type)
    return this.transactionRepository.findByType(type)
  }

  async listByCategory(categoryId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByCategory(categoryId)
  }

  async listByDateRange(from: string, to: string): Promise<Transaction[]> {
    if (!from || !to) throw new ValidationError('from and to date parameters are required')
    if (from > to) throw new ValidationError('from date must be before to date')
    return this.transactionRepository.findByDateRange(from, to)
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    if (input.amount <= 0) throw new ValidationError('amount must be positive')
    this.validateType(input.type)
    if (!input.categoryId?.trim()) throw new ValidationError('categoryId is required')
    if (!input.date?.trim()) throw new ValidationError('date is required')

    return this.transactionRepository.create({
      amount: input.amount,
      type: input.type,
      categoryId: input.categoryId,
      description: input.description?.trim() || undefined,
      date: input.date,
    })
  }

  async updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    if (input.amount !== undefined && input.amount <= 0) {
      throw new ValidationError('amount must be positive')
    }
    if (input.type !== undefined) this.validateType(input.type)

    const updated = await this.transactionRepository.update(id, input)
    if (!updated) throw new NotFoundError('Transaction')
    return updated
  }

  async deleteTransaction(id: string): Promise<void> {
    const deleted = await this.transactionRepository.delete(id)
    if (!deleted) throw new NotFoundError('Transaction')
  }

  private validateType(type: string): void {
    if (!VALID_TYPES.includes(type as never)) {
      throw new ValidationError('type must be either "income" or "expense"')
    }
  }
}
