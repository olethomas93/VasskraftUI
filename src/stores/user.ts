import { defineStore } from 'pinia'
import router from '../router'
import axios from 'axios'
import { useAuthStore } from './useAuthStore'
import { authStore } from './authStore'
export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false,
  }),
  actions: {
    async registerUser(email, password) {
      // this.loadingUser = true
      // try {
      //   const { user } = await createUserWithEmailAndPassword(auth, email, password)
      //   this.userData = { email: user.email, uid: user.uid }
      //   router.replace({ name: 'dashboard' })
      // } catch (error) {
      //   console.log(error)
      // } finally {
      //   this.loadingUser = false
      // }
    },
    // async loginUser(email, password) {
    //   this.loadingUser = true
    //   try {
    //     const { user } = await signInWithEmailAndPassword(auth, email, password)
    //     this.userData = { email: user.email, uid: user.uid }
    //     router.push({ name: 'dashboard' ,query:{uid:user.uid}})
    //   } catch (error) {
    //     console.log(error)
    //   } finally {
    //     this.loadingUser = false
    //   }
    // },
    async loginUser(email, password) {
      this.loadingUser = true
      const authStore = useAuthStore()
      try {
        const req = { email: email, password: password }
        const data = await axios.post('http://localhost:3000/v1/auth/login', req)

        //const { user } =  await axios.get('https://windy.northei.no/api/users')
        this.userData = data.data.user
        console.log(this.userData)
        authStore.setToken(data.data.tokens.access)
        router.push({ name: 'dashboard', query: { uid: this.userData.id } })
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingUser = false
      }
    },
    async logoutUser() {
      // try {
      //   await signOut(auth)
      //   this.userData = null
      //   router.replace({ name: 'login' })
      // } catch (error) {
      //   console.log(error)
      // }
    },
    currentUser() {
      return this.userData
    },
  },
})
