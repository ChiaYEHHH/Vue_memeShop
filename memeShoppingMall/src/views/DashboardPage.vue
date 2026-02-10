<template>
  <div class="container">

    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utilss/api'

const router = useRouter()
const isAuthenticated = ref(false)

const tokenAuth = async () => {
  try {
    // 正確的 cookie 解析方式
    const token = document.cookie.split('; ').find(row => row.startsWith('hexToken='))?.split('=')[1]

    if (!token) {
      console.log('No token found')
      router.push('/login')
      return
    }

    // 使用 api 實例發送請求（會自動帶上 Authorization Header）
    const resAuth = await api.post('v2/api/user/check')

    if (resAuth.data.success) {
      console.log('登入成功')
      isAuthenticated.value = true
    } else {
      console.log('登入錯誤:', resAuth.data)

      router.push('/login')
    }
  } catch (error) {
    console.error('登入錯誤:', error)
    console.error('錯誤詳情:', error.response?.data)
    // 在錯誤時也要跳轉回登入頁
    router.push('/login')
  }
}

// 組件掛載時檢查認證
onMounted(() => {
  tokenAuth()
})
</script>
