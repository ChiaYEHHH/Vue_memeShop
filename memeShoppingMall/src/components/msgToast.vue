<script setup>
// 吐司元件（修正版）
import { ref, onMounted, watch, nextTick } from 'vue'
import Toast from 'bootstrap/js/dist/toast'

const props = defineProps({
  // 父元件傳入的訊息物件，範例: { title, content, style }
  msg: {
    type: Object,
    default: () => ({}),
  },
})

const toast = ref(null)
let bsToast = null

const showToast = () => {
  if (toast.value) {
    // 銷毀舊的實例
    if (bsToast) {
      bsToast.dispose()
    }

    // 建立新的實例
    bsToast = new Toast(toast.value, {
      autohide: true,
      delay: 3000,
    })

    bsToast.show()
  }
}

onMounted(() => {
  if (props.msg && Object.keys(props.msg).length > 0) {
    showToast()
  }
})

// 當父元件更新 msg，顯示吐司
watch(
  () => props.msg,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      nextTick(() => {
        showToast()
      })
    }
  },
  { deep: true },
)
</script>
<template>
  <!-- Toast 容器：固定定位在右上角，不影響文檔流 -->
  <div class="toast-container position-fixed top-0 end-0 p-5" style="z-index: 999">
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="toast">
      <!-- 根據 msg.style 動態改變 header 背景色和文字色 -->
      <div class="toast-header text-white" :class="`bg-${msg?.style || 'danger'}`">
        <span
          :class="`bg-${msg?.style || 'danger'}`"
          class="p-2 rounded me-2 d-inline-block"
        ></span>
        <strong class="me-auto">{{ msg?.title }}</strong>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div class="toast-body" v-if="msg?.content">
        {{ msg.content }}
      </div>
    </div>
  </div>
</template>
