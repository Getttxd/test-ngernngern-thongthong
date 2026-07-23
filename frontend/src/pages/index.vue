<script setup lang="ts">
import { onMounted } from 'vue'
import { useSEO } from '@/composables/useSEO'
import { useTransactionStore } from '@/stores/use-transaction-store'
import { useCategoryStore } from '@/stores/use-category-store'

useSEO({
  title: 'Dashboard - NgernNgern ThongThong',
  description: 'Personal finance dashboard — track your income and expenses.',
  keywords: ['finance', 'income', 'expense', 'tracker', 'ngernngern', 'thongthong'],
})

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const { totalIncome, totalExpense, balance, transactions } = storeToRefs(transactionStore)

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { dateStyle: 'medium' })
}

function getCategoryName(categoryId: string): string {
  return categoryStore.categories.find(c => c.id === categoryId)?.name ?? categoryId
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
    <h1 class="text-h5 font-weight-bold mb-6">Dashboard</h1>

    <VRow class="mb-6">
      <VCol cols="12" sm="6" lg="4">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="success" variant="tonal" size="48">
              <VIcon icon="ri-arrow-up-circle-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">Total Income</div>
              <div class="text-h5 font-weight-bold text-success">
                {{ formatCurrency(totalIncome) }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg="4">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="error" variant="tonal" size="48">
              <VIcon icon="ri-arrow-down-circle-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">Total Expenses</div>
              <div class="text-h5 font-weight-bold text-error">
                {{ formatCurrency(totalExpense) }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg="4">
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar
              :color="balance >= 0 ? 'primary' : 'warning'"
              variant="tonal"
              size="48"
            >
              <VIcon icon="ri-wallet-3-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">Balance</div>
              <div
                class="text-h5 font-weight-bold"
                :class="balance >= 0 ? 'text-primary' : 'text-warning'"
              >
                {{ formatCurrency(balance) }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12">
        <VCard title="Recent Transactions">
          <VList lines="two">
            <VListItem
              v-for="tx in transactions.slice(0, 10)"
              :key="tx.id"
            >
              <template #prepend>
                <VAvatar
                  :color="tx.type === 'income' ? 'success' : 'error'"
                  variant="tonal"
                  size="36"
                >
                  <VIcon
                    :icon="tx.type === 'income' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    size="18"
                  />
                </VAvatar>
              </template>
              <VListItemTitle>
                <div class="d-flex justify-space-between">
                  <span>{{ getCategoryName(tx.categoryId) }}</span>
                  <span
                    :class="tx.type === 'income' ? 'text-success font-weight-bold' : 'text-error font-weight-bold'"
                  >
                    {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
                  </span>
                </div>
              </VListItemTitle>
              <VListItemSubtitle>
                {{ formatDate(tx.date) }}
                <template v-if="tx.description"> — {{ tx.description }}</template>
              </VListItemSubtitle>
            </VListItem>
            <VListItem v-if="transactions.length === 0" class="text-center text-medium-emphasis py-4">
              No transactions yet. Start by adding your first one!
            </VListItem>
          </VList>
          <VCardActions>
            <RouterLink :to="{ name: 'transaction-page' }">
              <VBtn variant="text" size="small">View all transactions</VBtn>
            </RouterLink>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
