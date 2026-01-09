<script setup>
// 吐司元件（修正版）
import { ref, onMounted, watch } from 'vue'
import Toast from 'bootstrap/js/dist/toast'

const props = defineProps({
  // 父元件傳入的訊息物件，範例: { title, content, style }
  msg: {
    type: Object,
    default: () => ({}),
  },
})
const msg = props.msg
const emit = defineEmits(['shown', 'hidden'])

const toast = ref(null)
let bsToast = null

onMounted(() => {
  if (!toast.value) return
  bsToast = new Toast(toast.value, { delay: 6000 })

  // 若組件掛載時已有 msg，則顯示一次
  if (msg && Object.keys(msg).length) {
    bsToast.show()
  }

  // 轉發 bootstrap 事件到父元件
  toast.value.addEventListener('shown.bs.toast', () => emit('shown'))
  toast.value.addEventListener('hidden.bs.toast', () => emit('hidden'))
})

// 當父元件更新 msg，顯示吐司
watch(
  () => msg,
  (newVal) => {
    if (!toast.value) return
    if (!newVal || !Object.keys(newVal).length) return
    if (!bsToast) bsToast = new Toast(toast.value, { delay: 6000 })
    bsToast.show()
  },
  { deep: true },
)
</script>
<template>
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="toast">
    <div class="toast-header">
      <span :class="`bg-${msg?.style || 'primary'}`" class="p-2 rounded me-2 d-inline-block"></span>
      <strong class="me-auto">{{ msg?.title }}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body" v-if="msg?.content">
      {{ msg.content }}
    </div>
  </div>
</template>
