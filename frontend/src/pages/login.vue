<script setup lang="ts">
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

import { VForm } from 'vuetify/components'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const router = useRouter()

const isProcessing = ref(false)
const refLoginForm = ref<VForm>()
const isPasswordVisible = ref(false)
const email = ref('')
const password = ref('')

async function onClickLogin() {
  const isFormValid = await refLoginForm?.value?.validate()
  if (!isFormValid?.valid)
    return
  // TODO: implement login
  router.push('/')
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4" style="background: linear-gradient(135deg, #FFF5F7 0%, #FCE4EC 50%, #F8BBD0 100%); min-height: 100vh;">
    <VCard class="auth-card pa-sm-4 pa-md-7 pa-0" min-width="420" elevation="0" rounded="xl" style="border: 1px solid #FADBE8;">
      <VCardText>
        <div class="d-flex flex-column align-center mb-4">
          <div class="text-center mb-3">
            <VIcon icon="ri-wallet-3-line" size="48" color="#FF6B9D" />
          </div>
          <h1 class="text-h5 font-weight-bold" style="color: #2D1B2E;">
            NgernNgern ThongThong
          </h1>
          <p class="text-body-2 mt-1 mb-0" style="color: #8A6B7A;">
            จัดการรายรับ รายจ่ายของคุณ
          </p>
        </div>
      </VCardText>

      <VCardText>
        <VForm ref="refLoginForm" @submit.prevent="onClickLogin">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="email"
                autofocus
                label="Email"
                type="email"
                :rules="[requiredValidator, emailValidator]"
                placeholder="your@email.com"
                variant="outlined"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="password"
                label="Password"
                placeholder="············"
                :rules="[requiredValidator]"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                variant="outlined"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <div class="d-flex align-center flex-wrap justify-space-between my-5 gap-4" />

              <VBtn
                block
                type="submit"
                :loading="isProcessing"
                color="#FF6B9D"
                size="large"
                rounded="lg"
                class="text-none"
              >
                เข้าสู่ระบบ
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VCardText class="text-center pt-0">
        <p class="text-caption" style="color: #8A6B7A;">
          NgernNgern ThongThong — Personal Finance Tracker
        </p>
      </VCardText>
    </VCard>
  </div>
</template>
