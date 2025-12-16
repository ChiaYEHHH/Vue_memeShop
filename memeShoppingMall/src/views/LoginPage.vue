<script setup>
// Composition API
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import axios from 'axios'
// import api from '@/utils/api'  // 引入你之前建立的 api 工具

// const router = useRouter()
const user = ref({
  username: '',
  password: ''
})

const signIn = async () => {
  try {
    // 使用環境變數構建完整的 API URL
    const apiUrl = `${import.meta.env.VITE_API_URL}v2/admin/signin`

    // 發送 POST 請求
    const response = await axios.post(apiUrl, user.value)

    // 在 console 顯示回應
    console.log('API Response:', response)
    console.log('Response Data:', response.data)

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
<script>
// optionAPI
  // export default{
  //   data(){
  //     return {
  //       user:{
  //         username:'',
  //         password:''
  //       },
  //     }
  //   },
  //   methods: {
  //     signIn(){
  //       console.log("login");
  //       const api = `${import.meta.env.VITE_API_URL}v2/admin/signin`
  //       console.log("api",api);

  //     }
  //   }
  // }
</script>

<style scoped>
/* .login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #667eea;
  margin-bottom: 0.5rem;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #5568d3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
} */
</style>
