import { defineStore } from 'pinia'
import router from '../router'
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useFirebaseAuth } from 'vuefire'

export const authStore = defineStore('storeAuth', {
  state: () => {
    return {
      email: '',
      password: '',
      auth: '',
      user: { id: '', email: ' ' },
    }
  },

  actions: {
    async login(email: any, password: any) {
      console.log(email)
      try {
        const res = await signInWithEmailAndPassword(useFirebaseAuth()!, email, password)

        if (res) {
          router.replace({ name: 'dashboard' })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async logout() {
      await signOut(this.auth!)
      router.replace({ name: 'login' })
      this.email = ''
      this.password = ''
    },
    init() {
      onAuthStateChanged(this.auth!, (user) => {
        if (user) {
          this.user.id = user.uid
          this.user.email = user.email!
          router.replace({ name: 'dashboard' })
        } else {
          this.user = { id: '', email: '' }
          router.replace({ name: 'login' })
        }
      })
    },
  },
})
