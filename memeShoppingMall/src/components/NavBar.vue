<script setup>
// Composition API
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
// import api from '@/utils/api'  // 引入你之前建立的 api 工具

const router = useRouter()
const isLoggingOut = ref(false)

const logout = async () => {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try {
    // 使用環境變數構建完整的 API URL
    const logoutApi = `${import.meta.env.VITE_API_URL}v2/logout`

    // 發送 POST 請求
    const response = await axios.post(logoutApi)
    console.log('Response Data:', response.data)

    // ⭐ 重點：無論 API 成功與否，都要清除本地狀態
    // 1. 清除 cookie
    document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // 2. 清除 axios 的 Authorization header
    delete axios.defaults.headers.common['Authorization']

    await router.push('/login')

  } catch (error) {
    console.error('登入錯誤:', error)
    console.error('錯誤詳情:', error.response?.data)
    // ⭐ 即使 API 失敗，也要清除本地狀態
    document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    delete axios.defaults.headers.common['Authorization']

    // 強制跳轉
    await router.push('/login')
  } finally {
    // 2. 清除 cookie（無論 API 成功與否）
    console.log('清除 cookie')
    document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // 3. 清除 axios header
    console.log('清除 Authorization header')
    delete axios.defaults.headers.common['Authorization']

    // 4. 驗證 cookie 是否已清除
    const remainingToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,"$1")
    console.log('Cookie 清除後檢查:', remainingToken ? '還存在！' : '已清除')

    // 5. 跳轉到登入頁
    console.log('準備跳轉到登入頁')
    await router.push('/login')
    console.log('router.push 執行完成')

    // 6. 檢查當前路由
    console.log('當前路由:', router.currentRoute.value.path)

    isLoggingOut.value = false
    console.log('===== 登出流程結束 =====')
  }
}
</script>
<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand text-secondary fs-1 fw-bolder" href="#">MEME Shop</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">

        <li class="nav-item">
          <router-link
            to="/dashboard"
            class="nav-link"
            active-class="active"
          >
            Dashboard
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/dashboard/products"
            class="nav-link"
            active-class="active"
          >
            Products
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logout">Logout</a>
        </li>
      </ul>
      <span class="navbar-text">
        迷因梗圖
      </span>
    </div>
  </div>
</nav>
</template>


