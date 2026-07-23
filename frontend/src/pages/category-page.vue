<script setup lang="ts">
import { useCategoryStore } from '@/stores/use-category-store'
import type { CreateCategoryBody, UpdateCategoryBody, Category } from '@/models'

const categoryStore = useCategoryStore()
const { categories, isLoading, error } = storeToRefs(categoryStore)

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Action', key: 'action', sortable: false, align: 'end' as const },
]

const dialog = ref(false)
const deleteDialog = ref(false)
const isSubmitting = ref(false)
const editingCategory = ref<Category | null>(null)
const deletingCategory = ref<Category | null>(null)

const form = ref<CreateCategoryBody & UpdateCategoryBody>({
  name: '',
  type: 'expense',
  icon: '',
  color: '',
})

function openCreate() {
  editingCategory.value = null
  form.value = { name: '', type: 'expense', icon: '', color: '' }
  dialog.value = true
}

function openEdit(category: Category) {
  editingCategory.value = category
  form.value = {
    name: category.name,
    type: category.type,
    icon: category.icon ?? '',
    color: category.color ?? '',
  }
  dialog.value = true
}

function openDelete(category: Category) {
  deletingCategory.value = category
  deleteDialog.value = true
}

async function submit() {
  isSubmitting.value = true
  try {
    const body = {
      name: form.value.name,
      type: form.value.type,
      icon: form.value.icon || undefined,
      color: form.value.color || undefined,
    }
    if (editingCategory.value)
      await categoryStore.updateCategory(editingCategory.value.id, body)
    else
      await categoryStore.createCategory(body as CreateCategoryBody)
    dialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

async function confirmDelete() {
  if (!deletingCategory.value) return
  isSubmitting.value = true
  try {
    await categoryStore.deleteCategory(deletingCategory.value.id)
    deleteDialog.value = false
  }
  finally {
    isSubmitting.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { dateStyle: 'medium' })
}

onMounted(() => categoryStore.fetchCategories())
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6">Categories</span>
        <VBtn
          color="primary"
          prepend-icon="ri-price-tag-3-line"
          @click="openCreate"
        >
          Add Category
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
        :items="categories"
        :loading="isLoading"
        hover
      >
        <template #item.type="{ item }">
          <VChip
            :color="item.type === 'income' ? 'success' : 'warning'"
            size="small"
            class="text-capitalize"
          >
            {{ item.type }}
          </VChip>
        </template>

        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
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
            No categories yet. Click "Add Category" to create one.
          </div>
        </template>
      </VDataTable>
    </VCard>

    <!-- Create / Edit Dialog -->
    <VDialog v-model="dialog" max-width="480" persistent>
      <VCard :title="editingCategory ? 'Edit Category' : 'Add Category'">
        <VCardText>
          <VForm @submit.prevent="submit">
            <VTextField
              v-model="form.name"
              label="Name"
              prepend-inner-icon="ri-price-tag-3-line"
              class="mb-4"
              required
            />
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
              v-model="form.icon"
              label="Icon (optional)"
              prepend-inner-icon="ri-emotion-line"
              placeholder="e.g. ri-food-line"
              class="mb-4"
            />
            <VTextField
              v-model="form.color"
              label="Color (optional)"
              prepend-inner-icon="ri-palette-line"
              placeholder="e.g. #4CAF50"
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
            {{ editingCategory ? 'Save' : 'Create' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard title="Delete Category">
        <VCardText>
          Are you sure you want to delete <strong>{{ deletingCategory?.name }}</strong>? This action cannot be undone.
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
