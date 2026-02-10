<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import UserNavbar from './components/UserNavbar.vue'

const route = useRoute()

// 判斷是否為登入頁或首頁
const isLoginPage = computed(() => {
  return route.path === '/login' || route.path === '/'
})

// 判斷是否需要認證（admin 路由）
const isAuthRequired = computed(() => {
  return route.meta.requiresAuth === true
})

// 判斷是否為公開頁面（user 路由），但排除登入頁
const isPublicPage = computed(() => {
  return route.meta.requiresAuth === false && !isLoginPage.value
})
</script>

<template>
  <div id="app">
    <!-- 需要認證的頁面顯示 NavBar（admin） -->
    <nav-bar v-if="isAuthRequired" />

    <!-- 公開頁面顯示 UserNavbar（user），但不包括登入頁 -->
    <user-navbar v-if="isPublicPage" />

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
