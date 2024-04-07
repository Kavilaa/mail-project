import axios from "axios"

const config = {
  baseURL: `http://localhost:3000`,
  withCredentials: true
}

export const axiosInstance = axios.create(config)

export const axiosInterceptorsInstance = axios.create(config)
axiosInterceptorsInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
