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

const emit = defineEmits(['showDetail', 'addCart'])
const showDetail = (id) => {
  console.log("product id", id)
  emit('showDetail', id);
}

const addCart = (id) => {
  console.log("addCart product id", id)
  emit('addCart', id);
}

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
</script>
<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th style="width:120px">圖片</th>
        <th style="width:40%">商品名稱</th>
        <th style="width:25%">價格</th>
        <th style="width:20%">細項</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr v-for="product in enabledProducts" :key="product.id">
        <td scope="row" class="align-middle" style="width:120px">
          <img
            :src="product.imageUrl"
            class="object-fit"
            :alt="product.title"
            style="height:100px;"
          />
        </td>
        <td class="align-middle">{{ product.title }}</td>
        <td class="align-middle">原價: <span class="text-muted text-decoration-line-through">{{ product.origin_price }}</span><br/><strong>特價: {{ product.price }}</strong></td>
        <td class="align-middle text-end">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="showDetail(product.id)">查看更多</button>
            <button type="button" class="btn btn-sm btn-outline-danger" @click="addCart(product.id)">加入購物車</button>
          </div>
        </td>
      </tr>
      <tr v-if="enabledProducts.length === 0" class="text-center py-5">
        <p class="text-muted">目前沒有符合商品</p>
      </tr>
    </tbody>
  </table>
</template>
