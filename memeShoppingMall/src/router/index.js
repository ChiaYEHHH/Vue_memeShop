import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false } // 不需要登入
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true } // 需要登入
    },
  ],
})
// 導航守衛
router.beforeEach((to, from, next) => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  )

  if (to.meta.requiresAuth && !token) {
    // 需要認證但沒有 token，重定向到登入頁
    next('/login')
  } else if (to.path === '/login' && token) {
    // 已登入但訪問登入頁，重定向到 Dashboard
    next('/dashboard')
  } else {
    next()
  }
})
export default router
