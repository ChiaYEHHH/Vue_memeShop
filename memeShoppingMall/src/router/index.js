import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import ProductPage from '@/views/ProductPage.vue'

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
      redirect: '/dashboard/products', // ✅ 添加預設子路由
      children:[
        {
          path: 'products',
          name: 'products',
          component: ProductPage,
        },
      ],
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

  if (to.meta.requiresAuth) {
    if (token) {
      next() // 有 token，允許訪問
    } else {
      next('/login') // 沒有 token，重定向到登入頁
    }
  }
  // 登入頁
  else if (to.path === '/login') {
    if (token) {
      next('/dashboard') // 已登入，重定向到 Dashboard
    } else {
      next() // 未登入，允許訪問登入頁
    }
  }
  // 其他頁面
  else {
    next() // 允許訪問
  }
})
export default router
