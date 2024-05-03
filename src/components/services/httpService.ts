import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

const http: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', //import.meta.env.VITE_BASEURL, // Adjust with your API's base URL
  withCredentials: true, // Important for cookies to be sent over cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: Set up a response interceptor to handle global errors
http.interceptors.response.use(
  (response: AxiosResponse) => response, // Just return the response if everything is fine
  (error: AxiosError) => {
    // You can handle global errors here, for example, if you want to centralize handling of certain status codes
    if (error.response?.status === 401) {
      // For example, handle 401 Unauthorized if the session has expired
      console.error('Session expired or not authorized.')
      // Here you could redirect to login or trigger a session refresh
    }
    return Promise.reject(error)
  },
)

export default http
