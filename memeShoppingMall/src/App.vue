<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()

const isLoginPage = computed(() => {
  return route.path === '/login' || route.path === '/'
})
</script>

<template>
  <div id="app">
    <!-- 只在非登入頁顯示 NavBar -->
    <NavBar v-if="!isLoginPage" />

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
