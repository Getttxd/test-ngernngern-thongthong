import type { CreateCategoryInput, UpdateCategoryInput, Category } from '../domain/entities/category'
import { ConflictError, NotFoundError, ValidationError } from '../domain/errors'
import type { CategoryRepository } from '../domain/repositories/category-repository'

const VALID_TYPES = ['income', 'expense'] as const

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async listCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll()
  }

  async getCategory(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id)
    if (!category) throw new NotFoundError('Category')
    return category
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    this.validateName(input.name)
    this.validateType(input.type)

    const existing = await this.categoryRepository.findByName(input.name.trim())
    if (existing) throw new ConflictError('Category name already exists')

    return this.categoryRepository.create({
      name: input.name.trim(),
      type: input.type,
      icon: input.icon,
      color: input.color,
    })
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    if (input.name !== undefined) this.validateName(input.name)
    if (input.type !== undefined) this.validateType(input.type)

    const updated = await this.categoryRepository.update(id, input)
    if (!updated) throw new NotFoundError('Category')
    return updated
  }

  async deleteCategory(id: string): Promise<void> {
    const deleted = await this.categoryRepository.delete(id)
    if (!deleted) throw new NotFoundError('Category')
  }

  private validateName(name: string): void {
    if (!name?.trim()) throw new ValidationError('name is required')
  }

  private validateType(type: string): void {
    if (!VALID_TYPES.includes(type as never)) {
      throw new ValidationError('type must be either "income" or "expense"')
    }
  }
}
