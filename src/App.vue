<template>
  <router-view />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  import { authStore } from './stores/authStore'

  const store = authStore()

  onMounted(() => {
    store.init()
  })
</script>

<style lang="scss">
  @import 'scss/main.scss';

  #app {
    font-family: 'Source Sans Pro', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  body {
    margin: 0;
  }
</style>
