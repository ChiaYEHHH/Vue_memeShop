import axios from 'axios'
// import { useRouter } from 'vue-router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // 將 timeout 調大，避免在後端回應較慢時過早中止
  timeout: 30000,
})

// 請求攔截器 - 自動添加 Authorization Header
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1]
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 響應攔截器 - 處理 403/401 錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 清除 token
      document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      // 跳轉到登入頁
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
