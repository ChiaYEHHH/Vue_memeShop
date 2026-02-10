import { ref } from 'vue'

/**
 * 商品分類篩選 Composable
 * @returns {Object} 包含分類篩選邏輯
 */
export function useProductFilter(productList) {
  const selectedCategory = ref('全部商品')
  const categories = ref([])
  const productFilterList = ref([])

  const initializeCategories = (products) => {
    if (!products || products.length === 0) return

    const allCategories = [...new Set(products.map((p) => p.category))]
    categories.value = ['全部商品', ...allCategories]
  }

  const filterCategory = (selected) => {
    selectedCategory.value = selected
    showFilterProduct()
  }

  const showFilterProduct = () => {
    console.log('showFilterProduct', selectedCategory.value, productList.value)
    productFilterList.value = []

    if (selectedCategory.value === '全部商品') {
      productFilterList.value = productList.value
    } else {
      productFilterList.value = productList.value.filter(
        (p) => p.category === selectedCategory.value
      )
    }
  }

  return {
    selectedCategory,
    categories,
    productFilterList,
    initializeCategories,
    filterCategory,
    showFilterProduct,
  }
}
