import { defineStore } from 'pinia'
import router from '../router'
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
    async loginUser(email, password) {
      this.loadingUser = true
      console.log(import.meta.env.BASE_URL)
      const authStore = useAuthStore()
      try {
        const req = { email: email, password: password }
        const data = await http({ method: 'POST', url: '/v1/auth/login', data: req })

        //const { user } =  await axios.get('https://windy.northei.no/api/users')
        this.userData = data.data
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
        const data = await http.get(`/v1/customers/${this.userData.customerId}`, {
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
        const data = await http.post(`/v1/vasskraft/getData`, req)
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
