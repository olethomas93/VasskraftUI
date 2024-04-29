// stores/authStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'

interface AuthState {
  token: string | null
  refreshToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
  }),
  actions: {
    setToken(newToken: string | null) {
      this.token = newToken
      if (newToken) {
        localStorage.setItem('token', newToken)
      }
    },
    setRefreshToken(newRefreshToken: string | null) {
      this.refreshToken = newRefreshToken
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken)
      }
    },
    async refreshToken() {
      try {
        const response = await axios.post('https://api.yoursite.com/refresh-token', {
          refreshToken: this.refreshToken,
        })
        this.setToken(response.data.token)
        return response.data.token
      } catch (error) {
        console.error('Failed to refresh token:', error)
        throw error
      }
    },
  },
})
