<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="email"
      class="mb-4"
      type="email"
      :label="t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      v-model="password"
      class="mb-4"
      type="password"
      :label="t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

    <div class="auth-layout__options flex items-center justify-between">
      <va-checkbox v-model="keepLoggedIn" class="mb-0" :label="t('auth.keep_logged_in')" />
      <router-link class="ml-1 va-link" :to="{ name: 'recover-password' }">{{
        t('auth.recover_password')
      }}</router-link>
    </div>

    <div class="flex justify-center mt-4">
      <va-button class="my-0" @click="signinRedirect">{{ t('auth.login') }}</va-button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { authStore } from '../../../stores/authStore'
  import { getRedirectResult, signInWithEmailAndPassword, signOut } from 'firebase/auth'
  import { useCurrentUser, useFirebaseAuth } from 'vuefire'
  const { t } = useI18n()

  const auth = useFirebaseAuth()
  const email = ref('')
  const password = ref('')
  const keepLoggedIn = ref(false)
  const emailErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const router = useRouter()
  const useAuthStore = authStore()

  const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)
  const error = ref(null)
  function signinRedirect() {
    emailErrors.value = email.value ? [] : ['Email is required']
    passwordErrors.value = password.value ? [] : ['Password is required']
    if (!formReady.value) return

    useAuthStore.login(email.value, password.value)
  }

  function onsubmit() {
    if (!formReady.value) return

    emailErrors.value = email.value ? [] : ['Email is required']
    passwordErrors.value = password.value ? [] : ['Password is required']

    router.push({ name: 'dashboard' })
  }

  onMounted(() => {
    getRedirectResult(auth!).catch((reason) => {
      console.error('Failed redirect result', reason)
      error.value = reason
    })
  })
</script>
