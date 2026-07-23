import z from 'zod'

export const transactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().uuid(),
  description: z.string().optional(),
  date: z.string(),
  createdAt: z.string().datetime(),
})

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1),
  description: z.string().optional(),
  date: z.string().min(1),
})

export const updateTransactionSchema = createTransactionSchema.partial()

export const idParamSchema = z.object({
  id: z.string().min(1),
})

export const typeParamSchema = z.object({
  type: z.enum(['income', 'expense']),
})

export const transactionResponseSchema = z.object({ data: transactionSchema })
export const transactionListResponseSchema = z.object({ data: z.array(transactionSchema) })
export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})
