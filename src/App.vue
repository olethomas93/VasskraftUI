<template>
  <router-view />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useUserStore } from './stores/user'
  import { authStore } from './stores/authStore'
  const userStore = useUserStore()
  const store = authStore()

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
  const subscribeUser = async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser.')
      return
    }
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BPsu0nfMzXeFex9k2ihmR_UA_FL_1mceom1Z_hZzFgA92vkMGbpWmhcU3MizJ8e80aO3jpfL66Igp0eVEGqemOg',
        ),
      })
      await fetch('http://api.northei.no/v1/webpush/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Push subscription failed:', error)
    }
  }
  onMounted(() => {
    //store.init()
    subscribeUser()
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
