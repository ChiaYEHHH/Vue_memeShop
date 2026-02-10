<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utilss/api'
import msgToast from '@/components/msgToast.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useToastMessage } from '@/composables/useToastMessage'

const route = useRoute()
const productDetail = ref({})
const isLoading = ref(false)
const errorMessage = ref('')

const { toastMsg } = useToastMessage()

const productDetails = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const productId = route.params.id

    if (!productId) {
      errorMessage.value = '未找到產品 ID'
      isLoading.value = false
      return
    }

    // ⭐ 步驟 1: 建構 API 相對路徑
    const productDetailApi = `v2/api/${import.meta.env.VITE_API_PATH}/product/${productId}`

    // ⭐ 步驟 2: 使用已配置好的 `api` 發送 GET 請求（包含 timeout）
    const resProductDetail = await api.get(productDetailApi)
    if (resProductDetail.data.success) {
      productDetail.value = resProductDetail.data.product
      console.log("productDetail",productDetail.value)
      isLoading.value = false
    } else {
      errorMessage.value = '無法取得產品資料'
      isLoading.value = false
    }
  } catch (error) {
    console.error('錯誤詳情:', error.response?.data)
    errorMessage.value = error.response?.data?.message || '獲取產品資料失敗'
    isLoading.value = false
  }
}

// 組件掛載時獲取產品詳情
onMounted(() => {
  productDetails()
})
</script>

<template>
  <loading :active="isLoading" :is-full-page="true" />
  <msg-toast :msg="toastMsg" />

  <div v-if="productDetail && Object.keys(productDetail).length > 0" class="container mt-5">
    <div class="row">
      <div class="col-md-6">
        <img :src="productDetail.imageUrl" class="img-fluid" :alt="productDetail.title" />
      </div>
      <div class="col-md-6">
        <h1>{{ productDetail.title }}</h1>
        <p class="text-muted">分類: {{ productDetail.category }}</p>
        <p class="text-danger">
          <span class="text-decoration-line-through me-2">${{ productDetail.origin_price }}</span>
          <span class="h3">${{ productDetail.price }}</span>
        </p>
        <p>{{ productDetail.description }}</p>
        <button class="btn btn-primary btn-lg w-100">加入購物車</button>
      </div>
    </div>
    <div class="row">
      <div class="col-12 mt-4">
        <h3>產品詳情</h3>
        <div class="img" v-for="(img, index) in productDetail.images" :key="index">
          <img :src="img" class="img-fluid" />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="errorMessage" class="alert alert-danger m-3">
    {{ errorMessage }}
  </div>

  <div v-else class="text-center py-5">
    <p class="text-muted">未找到產品資料</p>
  </div>
</template>
