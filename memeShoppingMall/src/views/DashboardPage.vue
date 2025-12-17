<template>
  <h1>DashboardPage</h1>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isAuthenticated = ref(false)
const tokenAuth = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,"$1",);
    console.log(`output->token`,token)

    if (!token) {
      console.log('No token found')
      router.push('/login')
      return
    }
    // import
    axios.defaults.headers.common['Authorization'] = token
    // 使用環境變數構建完整的 API URL
    const apiAuth = `${import.meta.env.VITE_API_URL}v2/api/user/check`
    // // 發送 POST 請求
    const resAuth = await axios.post(apiAuth)
    console.log(`output->resAuth`,resAuth)
    if (resAuth.data.success) {
      isAuthenticated.value = true
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error('登入錯誤:', error)
    console.error('錯誤詳情:', error.response?.data)
  }
}
// 組件掛載時檢查認證
onMounted(() => {
  tokenAuth()
})
</script>
