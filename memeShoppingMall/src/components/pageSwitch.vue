<script setup>
// import { ref, onMounted } from 'vue'
const props = defineProps({
  // 父元件傳入的訊息物件，範例: { title, content, style }
  pages: {
    type: Object,
    default: () => ({
      total_pages: 1,
      current_page: 1,
      has_next: false,
      has_pre: false,
    }),
  },
})

const emit = defineEmits(['change-page'])

const goToPreviousPage = () => {
  if (props.pages.has_pre && props.pages.current_page > 1) {
    emit('change-page', props.pages.current_page - 1)
  }
}
const goToNextPage = () => {
  if (props.pages.has_next && props.pages.current_page < props.pages.total_pages) {
    emit('change-page', props.pages.current_page + 1)
  }
}
const goToPage = (pageNum) => {
  if (pageNum >= 1 && pageNum <= props.pages.total_pages && pageNum !== props.pages.current_page) {
    emit('change-page', pageNum)
  }
}

const generatePages = () => {
  const total = props.pages.total_pages || 1
  const pages = []
  for (let i = 1; i <= total; i++) {
    pages.push(i)
  }
  return pages
}
</script>
<template>
  <nav aria-label="分頁導航" v-if="pages.total_pages > 1 " >
    <ul class="pagination justify-content-center">
      <!-- 上一頁 -->
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <button
          class="page-link"
          @click="goToPreviousPage"
          :disabled="!pages.has_pre"
          aria-label="上一頁"
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>

      <!-- 頁碼 -->
      <li
        class="page-item"
        v-for="page in generatePages()"
        :key="page"
        :class="{ active: page === pages.current_page }"
      >
        <button class="page-link" @click="goToPage(page)" :disabled="page === pages.current_page">
          {{ page }}
        </button>
      </li>

      <!-- 下一頁 -->
      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <button
          class="page-link"
          @click="goToNextPage"
          :disabled="!pages.has_next"
          aria-label="下一頁"
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
