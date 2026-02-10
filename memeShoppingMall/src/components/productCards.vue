<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSaveHandler } from '@/composables/useSaveHandler'
import { useToastMessage } from '@/composables/useToastMessage'

// 1) 接收外部 productList 當初值
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  // 接收外部傳入的 toastMsg ref（可選）
  externalToastMsg: {
    type: Object,
    default: null
  }
})

const productShowList = ref([])

// 如果父元件有傳入 toastMsg，則使用父元件的；否則用自己的
const { toastMsg: internalToastMsg } = useToastMessage()
const toastMsg = props.externalToastMsg || internalToastMsg

// 初始化 useSaveHandler for cart，使用傳入或內部的 toast
const { handleSave: addToCartHandler } = useSaveHandler(
  'cart',
  null,
  { externalToastMsg: toastMsg }
)

onMounted(() => {
  productShowList.value = props.products
  console.log("productShowList", props.products, productShowList.value)

})

// 用 computed 過濾啟用商品
const enabledProducts = computed(() => {
  return productShowList.value.filter(p => p.is_enabled === 1)
})

// 當父元件更新 products，更新本地
watch(
  () => props.products,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      productShowList.value = newVal
    }
  },
  { deep: true },
)

// 加入購物車
const addToCart = async (productId) => {
  console.log('addToCart', productId)
  const payload = {
    product_id: productId,
    qty: 1
  }
  await addToCartHandler(payload)
}
</script>
<template>
  <div class="row row-cols-3 g-3 my-3">
      <div class="col" v-for="product in enabledProducts" :key="product.id">
        <div class="card">
          <img
            :src="product.imageUrl"
            class="card-img-top object-fit"
            alt="product.title"
            style="height:300px"
          />
          <div class="card-body">
            <h6 class="card-title">
              {{ product.title }}
              <span class="float-end">$ {{product.price}}</span>
            </h6>
            <button type="button" class="btn btn-outline-primary w-100" @click="addToCart(product.id)">加入購物車</button>
          </div>
        </div>
      </div>
      <div v-if="enabledProducts.length === 0" class="text-center py-5">
          <p class="text-muted">目前沒有符合商品</p>
        </div>
    </div>
</template>
