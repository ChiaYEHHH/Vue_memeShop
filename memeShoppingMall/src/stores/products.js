import { ref, computed } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('ProductStore', () => {
  const products = ref([])
  // const doubleCount = computed(() => count.value * 2)
  async function getProductsList() {
    const productsList = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/products`

    // ⭐ 步驟 5: 發送 GET 請求 發送 POST 請求
    const resAuth = await axios.get(productsList)
    // console.log(`output->resAuth`,resAuth)
    if(resAuth.data.success){
      productList.value = resAuth.data.products
      pages.value = resAuth.data.pagination
    }
  }

  return { count, doubleCount, increment }
})
