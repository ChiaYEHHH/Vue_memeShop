<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utilss/api'

const router = useRouter()
const user = ref({
  username: '',
  password: '',
})

const signIn = async () => {
  try {
    // 發送 POST 請求
    const response = await api.post('v2/admin/signin', user.value)

    if (response.data.success) {
      // 將 token 存入 cookie
      const { token, expired } = response.data
      const expiryDate = new Date(expired)
      document.cookie = `hexToken=${token}; expires=${expiryDate.toUTCString()}; path=/`

      // 跳轉到儀表板
      router.push('/dashboard/products')
    }
  } catch (error) {
    console.error('登入錯誤:', error)
    console.error('錯誤詳情:', error.response?.data)
  }
}
</script>

<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit.prevent="signIn">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="username" class="sr-only">UserName</label>
          <input
            type="text"
            id="username"
            class="form-control"
            placeholder="user name"
            required
            autofocus
            v-model="user.username"
          />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <input
            type="password"
            id="inputPassword"
            class="form-control"
            placeholder="Password"
            required
            v-model="user.password"
          />
        </div>
        <div class="text-end mt-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
        </div>
      </div>
    </form>
  </div>
</template>
