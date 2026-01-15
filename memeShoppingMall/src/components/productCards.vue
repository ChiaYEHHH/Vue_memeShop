<script setup>
import { ref, computed, watch, onMounted } from 'vue'
// 1) 接收外部 productList 當初值
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

const productShowList = ref([])

onMounted(() => {
  productShowList.value = props.products
  console.log("productShowList", props.products, productShowList.value)

})

// ✅ 使用 computed 過濾，效能更好
const enabledProducts = computed(() => {
  return productShowList.value.filter(p => p.is_enabled === 1)
})

// 當父元件更新 category，更新本地
watch(
  () => props.products,
  (newVal) => {
    console.log('newVal',newVal)
    if (newVal && newVal.length > 0) {
      productShowList.value = newVal
    }
  },
  { deep: true },
)
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
            <a href="#" class="btn btn-outline-primary w-100">加入購物車</a>
          </div>
        </div>
      </div>
      <div v-if="enabledProducts.length === 0" class="text-center py-5">
          <p class="text-muted">目前沒有符合商品</p>
        </div>
    </div>
</template>
