<script setup lang="ts">
import { useCategoryStore } from '@/stores/use-category-store'
import { useTransactionStore } from '@/stores/use-transaction-store'
import type { CreateTransactionBody, UpdateTransactionBody, Transaction } from '@/models'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const { transactions, isLoading, error } = storeToRefs(transactionStore)
const { categories } = storeToRefs(categoryStore)

const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Description', key: 'description' },
  { title: 'Category', key: 'categoryId' },
  { title: 'Amount', key: 'amount' },
  { title: 'Action', key: 'action', sortable: false, align: 'end' as const },
]

const dialog = ref(false)
const deleteDialog = ref(false)
const isSubmitting = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const deletingTransaction = ref<Transaction | null>(null)

const form = ref<CreateTransactionBody & UpdateTransactionBody>({
  amount: 0,
  type: 'expense',
  categoryId: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
})

function openCreate() {
  editingTransaction.value = null
  form.value = {
    amount: 0,
    type: 'expense',
    categoryId: categories.value.length > 0 ? categories.value[0].id : '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  }
  dialog.value = true
}

function openEdit(transaction: Transaction) {
  editingTransaction.value = transaction
  form.value = {
    amount: transaction.amount,
    type: transaction.type,
    categoryId: transaction.categoryId,
    description: transaction.description ?? '',
    date: transaction.date,
  }
  dialog.value = true
}

function openDelete(transaction: Transaction) {
  deletingTransaction.value = transaction
  deleteDialog.value = true
}

function getCategoryName(categoryId: string): string {
  return categories.value.find(c => c.id === categoryId)?.name ?? categoryId
}

async function submit() {
  isSubmitting.value = true
  try {
    const body = {
      amount: form.value.amount,
      type: form.value.type,
      categoryId: form.value.categoryId,
      description: form.value.description || undefined,
      date: form.value.date,
    }
    if (editingTransaction.value)
      await transactionStore.updateTransaction(editingTransaction.value.id, body)
    else
      await transactionStore.createTransaction(body as CreateTransactionBody)
    dialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

async function confirmDelete() {
  if (!deletingTransaction.value) return
  isSubmitting.value = true
  try {
    await transactionStore.deleteTransaction(deletingTransaction.value.id)
    deleteDialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

function formatCurrency(amount: number, type: 'income' | 'expense'): string {
  const formatted = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(amount)
  return type === 'income' ? `+${formatted}` : `-${formatted}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { dateStyle: 'medium' })
}

onMounted(async () => {
  await Promise.all([
    transactionStore.fetchTransactions(),
    categoryStore.fetchCategories(),
  ])
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6">Transactions</span>
        <VBtn
          color="primary"
          prepend-icon="ri-exchange-dollar-line"
          @click="openCreate"
        >
          Add Transaction
        </VBtn>
      </VCardTitle>

      <VDivider />

      <VAlert
        v-if="error"
        type="error"
        class="ma-4"
        :text="error"
        closable
      />

      <VDataTable
        :headers="headers"
        :items="transactions"
        :loading="isLoading"
        hover
      >
        <template #item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>

        <template #item.description="{ item }">
          {{ item.description || '-' }}
        </template>

        <template #item.categoryId="{ item }">
          <VChip size="small">
            {{ getCategoryName(item.categoryId) }}
          </VChip>
        </template>

        <template #item.amount="{ item }">
          <span :class="item.type === 'income' ? 'text-success font-weight-bold' : 'text-error font-weight-bold'">
            {{ formatCurrency(item.amount, item.type) }}
          </span>
        </template>

        <template #item.action="{ item }">
          <IconBtn @click="openEdit(item)">
            <VTooltip activator="parent" location="top">Edit</VTooltip>
            <VIcon icon="ri-pencil-line" />
          </IconBtn>
          <IconBtn color="error" @click="openDelete(item)">
            <VTooltip activator="parent" location="top">Delete</VTooltip>
            <VIcon icon="ri-delete-bin-line" />
          </IconBtn>
        </template>

        <template #no-data>
          <div class="text-center py-8 text-disabled">
            No transactions yet. Click "Add Transaction" to record one.
          </div>
        </template>
      </VDataTable>
    </VCard>

    <!-- Create / Edit Dialog -->
    <VDialog v-model="dialog" max-width="520" persistent>
      <VCard :title="editingTransaction ? 'Edit Transaction' : 'Add Transaction'">
        <VCardText>
          <VForm @submit.prevent="submit">
            <VSelect
              v-model="form.type"
              label="Type"
              :items="[
                { title: 'Income', value: 'income' },
                { title: 'Expense', value: 'expense' },
              ]"
              prepend-inner-icon="ri-swap-line"
              class="mb-4"
              required
            />
            <VTextField
              v-model.number="form.amount"
              label="Amount"
              type="number"
              prepend-inner-icon="ri-money-dollar-circle-line"
              class="mb-4"
              min="0"
              step="0.01"
              required
            />
            <VSelect
              v-model="form.categoryId"
              label="Category"
              :items="categories.map(c => ({ title: c.name, value: c.id }))"
              prepend-inner-icon="ri-price-tag-3-line"
              class="mb-4"
              required
            />
            <VTextField
              v-model="form.date"
              label="Date"
              type="date"
              prepend-inner-icon="ri-calendar-line"
              class="mb-4"
              required
            />
            <VTextField
              v-model="form.description"
              label="Description (optional)"
              prepend-inner-icon="ri-edit-line"
            />
          </VForm>
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="dialog = false">Cancel</VBtn>
          <VBtn
            color="primary"
            :loading="isSubmitting"
            @click="submit"
          >
            {{ editingTransaction ? 'Save' : 'Create' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard title="Delete Transaction">
        <VCardText>
          Are you sure you want to delete this transaction of
          <strong>{{ deletingTransaction ? formatCurrency(deletingTransaction.amount, deletingTransaction.type) : '' }}</strong>?
          This action cannot be undone.
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn variant="text" @click="deleteDialog = false">Cancel</VBtn>
          <VBtn
            color="error"
            :loading="isSubmitting"
            @click="confirmDelete"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
