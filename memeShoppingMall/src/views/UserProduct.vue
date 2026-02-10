<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utilss/api'
import ProductCategoryBtn from '@/components/productCategoryBtn.vue'
import UserProducts from '@/components/userProducts.vue'
import msgToast from '@/components/msgToast.vue'
import { useSaveHandler } from '@/composables/useSaveHandler'
import { useToastMessage } from '@/composables/useToastMessage'
// import pageSwitch from '@/components/pageSwitch.vue'
// import Loading from 'vue-loading-overlay'

const router = useRouter()
const productList = ref([])
const productFilterList = ref([])
const pages = ref({})
const selectedCategory = ref('全部商品')
const categories = ref([])
// const currentPage = ref(1)
// 初始化 useToastMessage 作為主要的 toast 管理
const { toastMsg } = useToastMessage()

// 初始化 useSaveHandler，傳入成功回調（刷新列表）和外部 toastMsg ref
const { handleSave: saveApiHandler } = useSaveHandler(
  'cart',
  "",
  { externalToastMsg: toastMsg },
)

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
// 切換商品細節頁面
const routeDetail = (id) => {
  console.log('routeDetail', id)
  router.push('/MeMeStore/userboard/productDetail/' + id)
}

// 加入購物車
const addToCart = async (id) => {
  const payload = {
    product_id: id,
    qty: 1
  }
  await saveApiHandler(payload)
}
// 顯示類別商品
const showFilterProduct = () => {
  productFilterList.value = []
  if (selectedCategory.value === '全部商品') {
    productFilterList.value = productList.value
  } else {
    productFilterList.value = productList.value.filter((p) => p.category === selectedCategory.value)
  }
}

onMounted(() => {
  productAllList()
})
</script>

<template>
  <div class="container">
    <msg-toast :msg="toastMsg" />
    <div class="row mt-3">
      <div class="col-2 m-auto mt-5">
        <product-category-btn
          v-model:selectedCategory="selectedCategory"
          :category="categories"
          @selectCategory="filterCategory"
        />
      </div>
      <div class="col-9">
        <user-products
          :products="productFilterList"
          @showDetail="routeDetail"
          @addCart="addToCart"
        />
      </div>
    </div>
  </div>
</template>
