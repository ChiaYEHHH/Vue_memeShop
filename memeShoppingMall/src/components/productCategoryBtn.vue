<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  // 父元件傳入的訊息物件，範例: { title, content, style }
  category: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: '全部商品',
  },
})

// 對外事件
const emit = defineEmits(['selectCategory', 'update:selectedCategory'])
const categories = ref([])
const localSelectedCategory = ref('全部商品')

const selectCategory = (item) => {
  console.log("selectCategory item", item)
  localSelectedCategory.value = item
  emit('update:selectedCategory', item)
  emit('selectCategory', localSelectedCategory.value)
}

onMounted(() => {
  if (props.category && props.category.length > 0) {
    categories.value = props.category
    console.log("cat", categories.value)
  }
})

// 當父元件更新 category，更新本地
watch(
  () => props.category,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      categories.value = newVal
    }
  },
  { deep: true },
)

// 當父元件更新 selectedCategory，同步本地
watch(
  () => props.selectedCategory,
  (newVal) => {
    localSelectedCategory.value = newVal
  },
)
</script>
<template>
  <ul class="list-group justify-content-center mt-3">
    <li class="list-group-item list-group-item-action"
      v-for="cat in categories"
      :key="cat"
    >
      <a
        class="nav-link text-dark" href="#"
        @click.prevent="selectCategory(cat)"
        :class="{ 'active': localSelectedCategory === cat }"
      >
        {{ cat }}
      </a>
    </li>
  </ul>
</template>
