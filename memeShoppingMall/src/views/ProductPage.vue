<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import axios from 'axios'
import api from '@/utilss/api'
import productModal from '@/components/productModal.vue'
import deleteModal from '@/components/deleteModal.vue'
import msgToast from '@/components/msgToast.vue'
import pageSwitch from '@/components/pageSwitch.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const router = useRouter()
const productList = ref([])
const pages = ref({})
const currentPage = ref(1)
const tempProduct = ref(null)
const productModalRef = ref(null)
const deleteModalRef = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const toastMsg = ref({})

const productAllList = async (page = 1) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    // ⭐ 步驟 1: 先取得 token
    // 正確的 cookie 解析方式
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1]
    // ⭐ 步驟 2: 檢查 token 是否存在
    if (!token) {
      console.error('❌ 沒有找到 token')
      errorMessage.value = '請先登入'
      router.push('/login')
      return
    }
    // ⭐ 步驟 3: 驗證 token 是否存在
    // `api` 的請求攔截器會自動把 token 加到 Authorization header，所以這裡不需要手動設置
    // ⭐ 步驟 4: 建構 API 相對路徑並加入分頁參數（讓 api.baseURL 生效）
    const productsList = `v2/api/${import.meta.env.VITE_API_PATH}/admin/products?page=${page}`

    // ⭐ 步驟 5: 使用已配置好的 `api` 發送 GET 請求（包含 timeout & Authorization 攔截器）
    const resAuth = await api.get(productsList)
    if (resAuth.data.success) {
      productList.value = resAuth.data.products
      pages.value = resAuth.data.pagination
      currentPage.value = page
      isLoading.value = false
    } else {
      errorMessage.value = '無法取得產品資料'
      isLoading.value = false
    }
  } catch (error) {
    console.error('錯誤詳情:', error.response?.data)

    isLoading.value = false
  }
}

const addProduct = () => {
  tempProduct.value = null
  productModalRef.value.show() // 新增：清空並開啟
}

const editItem = (item) => {
  tempProduct.value = item
  console.log(item)
  productModalRef.value.show(item) // 編輯：載入 item 並開啟
}

const delItem = (item) => {
  tempProduct.value = item
  console.log(item)
  // 開啟刪除 Modal
  deleteModalRef.value.show(item)
}

const handleDelete = async (item) => {
  isLoading.value = true
  try {
    const delproductApi = `v2/api/${import.meta.env.VITE_API_PATH}/admin/product/${item.id}`
    const delResult = await api.delete(delproductApi)
    // console.log(`output->delResult`, delResult)
    toastMsg.value = {
      title: delResult.data.message,
      content: delResult.data.message,
    }
    if (delResult.data.success) {
      toastMsg.value.style = 'success'
      await productAllList(currentPage.value)
    }
  } catch (error) {
    toastMsg.value = {
      title: error.message,
      content: error.response.data.message[0],
    }
  } finally {
    isLoading.value = false
  }
}

const handleSave = async (payload) => {
  tempProduct.value = payload
  isLoading.value = true
  try {
    let resHandleSave = null
    const saveData = { data: tempProduct.value }
    if (tempProduct.value.id) {
      // 編輯更新
      const editApi = `v2/api/${import.meta.env.VITE_API_PATH}/admin/product/${tempProduct.value.id}`
      resHandleSave = await api.put(editApi, saveData)
    } else {
      // 新增
      const addApi = `v2/api/${import.meta.env.VITE_API_PATH}/admin/product`
      resHandleSave = await api.post(addApi, saveData)
    }
    toastMsg.value = {
      title: resHandleSave.data.message,
      content: resHandleSave.data.message,
    }
    if (resHandleSave.data.success) {
      toastMsg.value.style = 'success'
      await productAllList(currentPage.value)
    }
  } catch (error) {
    toastMsg.value = {
      title: error.message,
      content: error.response.data.message[0],
    }
  } finally {
    isLoading.value = false
  }
}

// 組件掛載時檢查認證
onMounted(() => {
  productAllList(currentPage.value)
})
</script>

<template>
  <loading :active="isLoading" :is-full-page="true" />
  <msg-toast :msg="toastMsg" />
  <div class="text-end p-3">
    <button type="button" class="btn btn-primary" @click="addProduct">新增</button>
  </div>
  <table class="table table-hover">
    <thead class="table-light">
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in productList" :key="item.id">
        <td>{{ item.category }}</td>
        <td>{{ item.title }}</td>
        <td class="text-right">{{ item.origin_price }}</td>
        <td class="text-right">{{ item.price }}</td>
        <td class="text-center">
          <!-- <span class="badge" :class="item.is_enabled ? 'bg-success' : 'bg-secondary'">
            {{ item.is_enabled ? '啟用' : '未啟用' }}
          </span> -->
          <span class="badge bg-success" v-if="item.is_enabled">啟用</span>
          <span class="badge bg-secondary" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click="editItem(item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="delItem(item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <page-switch :pages="pages" @change-page="productAllList" />

  <product-modal ref="productModalRef" :product="tempProduct" @save="handleSave" />
  <delete-modal ref="deleteModalRef" :delItem="tempProduct" @delete="handleDelete" />
</template>
