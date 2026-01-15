<script setup>
import { ref, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import api from '@/utilss/api'
import ProductCategory from '@/components/productCategory.vue'
import ProductCard from '@/components/productCards.vue'
// import pageSwitch from '@/components/pageSwitch.vue'
// import Loading from 'vue-loading-overlay'

// const router = useRouter()
const productList = ref([])
const productFilterList = ref([])
const pages = ref({})
const selectedCategory = ref('全部商品')
const categories = ref([])
// const currentPage = ref(1)
// const toastMsg = ref({})

const productAllList = async () => {
  // isLoading.value = true
  try {
    const productsList = `v2/api/${import.meta.env.VITE_API_PATH}/products/all`

    const resAuth = await api.get(productsList)
    if (resAuth.data.success) {
      productList.value = resAuth.data.products
      console.log('resAuthproductList.value', productList.value)
      pages.value = resAuth.data.pagination
      const allCategories = [...new Set(resAuth.data.products.map((p) => p.category))]
      categories.value = ['全部商品', ...allCategories]
      showFilterProduct()
      // currentPage.value = page
      // isLoading.value = false
    } else {
      // errorMessage.value = '無法取得產品資料'
      // isLoading.value = false
    }
  } catch (error) {
    console.error('錯誤詳情:', error.response?.data)
    // isLoading.value = false
  }
}

// 切換類別
const filterCategory = (selected) => {
  console.log('filterCategory', selected)
  selectedCategory.value = selected
  showFilterProduct()
}

// 顯示類別商品
const showFilterProduct = () => {
  console.log('showFilterProduct', selectedCategory.value, productList.value)
  productFilterList.value = []
  if (selectedCategory.value === '全部商品') {
    productFilterList.value = productList.value
  } else {
    productFilterList.value = productList.value.filter((p) => p.category === selectedCategory.value)
  }
  console.log('showFilterProduct', selectedCategory.value, productList.value)
}

onMounted(() => {
  productAllList()
})
</script>

<template>
  <product-category
    v-model:selectedCategory="selectedCategory"
    :category="categories"
    @selectCategory="filterCategory"
  />
  <product-card :products="productFilterList" />
</template>
