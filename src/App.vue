<template>
  <router-view />
</template>

<script setup lang="ts">
  import { onMounted, getCurrentInstance } from 'vue'
  import { useUserStore } from './stores/user'
  import { authStore } from './stores/authStore'
  import { useColors, useToast } from 'vuestic-ui'

  const userStore = useUserStore()
  const store = authStore()
  const { colors } = useColors()
  const { init: initToast } = useToast()
  // ---- utils ----
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
    return outputArray
  }

  // Put your real public VAPID key here, or fetch it from your API
  const VAPID_PUBLIC_KEY = 'BPsu0nfMzXeFex9k2ihmR_UA_FL_1mceom1Z_hZzFgA92vkMGbpWmhcU3MizJ8e80aO3jpfL66Igp0eVEGqemOg'

  // ---- service worker registration ----
  async function ensureServiceWorkerRegistered() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers not supported.')
      return null
    }
    // Register if not already
    let reg = await navigator.serviceWorker.getRegistration()
    if (!reg) {
      reg = await navigator.serviceWorker.register('/sw.js')
    }
    // Wait until it’s active/ready to receive push
    await navigator.serviceWorker.ready
    return reg
  }

  // ---- push subscription flow ----
  async function getOrCreateSubscription(registration: ServiceWorkerRegistration) {
    // Reuse existing sub if present
    let sub = await registration.pushManager.getSubscription()
    if (sub) return sub

    // Make sure we have permission (ideally ask on a user gesture)
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission()
      if (result !== 'granted') throw new Error('Notifications permission denied')
    } else if (Notification.permission !== 'granted') {
      throw new Error('Notifications permission denied')
    }

    // Subscribe
    sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })
    return sub
  }

  async function sendSubscriptionToServer(sub: PushSubscription) {
    // If you need to associate a user, include a token or user id here
    const body = sub.toJSON()
    // NOTE: fixed domain typo: wwww -> www
    const res = await fetch('https://www.api.northei.no/v1/webpush/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // credentials: 'include', // <-- if your API needs cookies
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Failed to save subscription: ${res.status} ${text}`)
    }
  }

  async function subscribeUser() {
    const registration = await ensureServiceWorkerRegistered()
    if (!registration) return

    const sub = await getOrCreateSubscription(registration)
    await sendSubscriptionToServer(sub)
  }

  // ---- message listener from the SW ----
  function attachServiceWorkerMessageListener() {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
      const toast = getCurrentInstance()?.proxy?.$vaToast

      // Support both shapes:
      // 1) { type:'PUSH_MESSAGE', message: '...' }
      // 2) { type:'PUSH_MESSAGE', payload: { title, body, ... } }
      const isPush = event.data && event.data.type === 'PUSH_MESSAGE'
      if (!isPush) return

      const msg =
        event.data?.message ?? event.data?.payload?.body ?? JSON.stringify(event.data?.payload ?? 'New notification')

      if (toast) {
        toast.init({
          message: msg,
          color: 'primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        const color = colors.primary
        initToast({ message: msg, color })
        //alert(msg)
      }
    })
  }

  onMounted(async () => {
    // store.init()
    try {
      await subscribeUser()
    } catch (err) {
      console.error('Push subscription failed:', err)
    }
    attachServiceWorkerMessageListener()
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
