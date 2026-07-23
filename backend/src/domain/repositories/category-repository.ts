import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../entities/category'

export interface CategoryRepository {
  findAll(): Promise<Category[]>
  findById(id: string): Promise<Category | null>
  findByName(name: string): Promise<Category | null>
  create(input: CreateCategoryInput): Promise<Category>
  update(id: string, input: UpdateCategoryInput): Promise<Category | null>
  delete(id: string): Promise<boolean>
}
