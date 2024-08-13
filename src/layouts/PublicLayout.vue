<template>
  <div class="test auth-layout grid grid-cols-12 content-center">
    <img class="test" src="/login.webp" />

    <div class="flex justify-center col-span-12 p-4">
      <va-card class="auth-layout__card">
        <va-card-content>
          <va-separator />

          <div class="p-3">
            <router-view />
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script>
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'AuthLayout',
    setup() {
      const { t } = useI18n()
      return { t }
    },
    data() {
      return {
        selectedTabIndex: 0,
      }
    },
    computed: {
      tabIndex: {
        set(tabName) {
          this.$router.push({ name: tabName })
        },
        get() {
          return this.$route.name
        },
      },
    },
  }
</script>
<style>
  .test {
    position: absolute;
    z-index: -99999;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.3);
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    object-fit: cover;
  }
</style>
<style lang="scss">
  .auth-layout {
    min-height: 100vh;
    background-image: linear-gradient(to right, var(--va-background-primary), var(--va-white));

    &__card {
      width: 100%;
      max-width: 400px;
    }
  }
</style>
