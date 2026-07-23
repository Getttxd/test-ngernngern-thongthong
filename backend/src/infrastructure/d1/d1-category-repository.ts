import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../../domain/entities/category'
import type { CategoryRepository } from '../../domain/repositories/category-repository'

interface CategoryRow {
  id: string
  name: string
  type: string
  icon: string | null
  color: string | null
  created_at: string
}

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type as 'income' | 'expense',
    icon: row.icon ?? undefined,
    color: row.color ?? undefined,
    createdAt: row.created_at,
  }
}

export class D1CategoryRepository implements CategoryRepository {
  constructor(private readonly db: D1Database) {}

  async findAll(): Promise<Category[]> {
    const { results } = await this.db
      .prepare('SELECT id, name, type, icon, color, created_at FROM categories ORDER BY type, name')
      .all<CategoryRow>()
    return results.map(toCategory)
  }

  async findById(id: string): Promise<Category | null> {
    const row = await this.db
      .prepare('SELECT id, name, type, icon, color, created_at FROM categories WHERE id = ?')
      .bind(id)
      .first<CategoryRow>()
    return row ? toCategory(row) : null
  }

  async findByName(name: string): Promise<Category | null> {
    const row = await this.db
      .prepare('SELECT id, name, type, icon, color, created_at FROM categories WHERE name = ?')
      .bind(name)
      .first<CategoryRow>()
    return row ? toCategory(row) : null
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    await this.db
      .prepare('INSERT INTO categories (id, name, type, icon, color, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, input.name, input.type, input.icon ?? null, input.color ?? null, createdAt)
      .run()
    return { id, name: input.name, type: input.type, icon: input.icon, color: input.color, createdAt }
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const name = input.name ?? existing.name
    const type = input.type ?? existing.type
    const icon = input.icon !== undefined ? input.icon : existing.icon
    const color = input.color !== undefined ? input.color : existing.color
    await this.db
      .prepare('UPDATE categories SET name = ?, type = ?, icon = ?, color = ? WHERE id = ?')
      .bind(name, type, icon ?? null, color ?? null, id)
      .run()
    return { ...existing, name, type, icon, color }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
    return result.meta.changes > 0
  }
}
