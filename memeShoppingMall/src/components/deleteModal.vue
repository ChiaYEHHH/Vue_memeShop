<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'

// 接收外部 delItem
const props = defineProps({
  delItem: {
    type: Object,
    default: () => ({})
  }
})

// 對外事件
const emit = defineEmits(['delete', 'cancel', 'shown', 'hidden'])

// Modal 實體
const DeleteModal = ref(null)
let modalInstance = null

function show () {
  if (!modalInstance) return
  modalInstance.show()
}

function hide () {
  if (!modalInstance) return
  modalInstance.hide()
}

function onDelete () {
  emit('delete', props.delItem)
  hide()
}

function onCancel () {
  emit('cancel')
  hide()
}

onMounted(() => {
  // 正確初始化 Bootstrap Modal
  if (!DeleteModal.value) return
  modalInstance = new Modal(DeleteModal.value, {
    backdrop: 'static',
    keyboard: true
  })
  DeleteModal.value.addEventListener('shown.bs.modal', () => emit('shown'))
  DeleteModal.value.addEventListener('hidden.bs.modal', () => emit('hidden'))
})

// 暴露方法給父層
defineExpose({ show, hide })

</script>
<template>
  <div class="modal fade" id="delModal" aria-hidden="true" ref="DeleteModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">刪除產品</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>確定要刪除此產品嗎？</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="onCancel">取消</button>
          <button type="button" class="btn btn-danger" @click="onDelete">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>


