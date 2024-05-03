import { defineStore } from 'pinia'
import router from '../router'
import axios from 'axios'
import { useAuthStore } from './useAuthStore'
import http from '../components/services/httpService'
export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null,
    customerData: null,
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
        const data = await axios.post('http://localhost:3000' + '/v1/auth/login', req, { withCredentials: true })

        //const { user } =  await axios.get('https://windy.northei.no/api/users')
        this.userData = data.data
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
      try {
        localStorage.removeItem('token')
        this.userData = null
        router.replace({ name: 'login' })
      } catch (error) {
        console.log(error)
      }
    },
    async getCustomer() {
      try {
        const data = await axios.get('http://localhost:3000' + `/v1/customers/${this.userData.customerId}`, {
          withCredentials: true,
        })
        this.customerData = data.data.customer
        return data.data.customer
      } catch (error) {
        console.log(error)
      }
    },
    async getSensorHistory(req) {
      try {
        const data = await axios.post('http://localhost:3000' + `/v1/vasskraft/getData`, req, { withCredentials: true })
        return data.data
      } catch (error) {
        console.log(error)
      }
    },
    currentUser() {
      return this.userData
    },
  },
})
