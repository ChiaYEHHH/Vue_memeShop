<script setup>
import { ref, reactive, watch, onMounted} from 'vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'
import dayjs from 'dayjs'


// 1) 接收外部 coupon 當編輯初值
const props = defineProps({
  coupon: {
    type: Object,
    default: () => ({})
  }
})

// 2) 對外事件
const emit = defineEmits(['save', 'cancel', 'shown', 'hidden'])

// 3) 本地表單（可依你的資料結構調整）
const form = reactive({
  id: '',
  title: '',
  percent: '',
  due_date: '',
  code: '',
  is_enabled: 0,
})

// 4) Modal 實體
const CouponModal = ref(null)
let modalInstance = null

// 5) 當外部 coupon 變更 → 寫入本地表單
watch(
  () => props.coupon,
  (val) => {
    if (val && val.id) {
      form.id = val.id ?? ''
      form.title = val.title ?? ''
      form.percent = val.percent ?? ''
      // 如果 due_date 已經是 datetime-local 格式則直接使用，否則轉換
      form.due_date = dayjs(val.due_date).tz('Asia/Taipei').format('YYYY-MM-DDTHH:mm')??''
      form.code = val.code ?? ''
      form.is_enabled = val.is_enabled ?? 0
    } else {
      // 新增情境：清空
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm () {
  form.id = ''
  form.title = ''
  form.percent = ''
  form.due_date = ''
  form.code = ''
  form.is_enabled = 0
}

function show () {
  // 如果父層傳入 coupon
  if (props.coupon && props.coupon.id) {
    console.log("props.coupon",props.coupon.title);
    form.id = props.coupon.id??''
    form.title = props.coupon.title??''
    form.percent = props.coupon.percent??''
    form.due_date = dayjs(props.coupon.due_date).tz('Asia/Taipei').format('YYYY-MM-DDTHH:mm')??''
    form.code = props.coupon.code??''
    form.is_enabled = props.coupon.is_enabled ?? 0
  } else {
    // 新增情境
    resetForm()
  }
  modalInstance?.show()
}

function hide () {
  modalInstance?.hide()
}

function onSave () {
  // 將 due_date 轉換成 timestamp（毫秒）
  const formData = { ...form }
  if (formData.due_date) {
    // datetime-local 格式：'2026-01-12T15:30'
    // 使用 dayjs 解析本地時間並轉換為 timestamp
    formData.due_date = dayjs(formData.due_date, 'YYYY-MM-DDTHH:mm').tz('Asia/Taipei').valueOf()
  }
  console.log("onSave",formData);
  emit('save', formData)
  hide()
}

function onCancel () {
  emit('cancel')
  hide()
}


onMounted(() => {
  // 正確初始化 Bootstrap Modal
  modalInstance = new Modal(CouponModal.value, {
    backdrop: 'static', // 依需求
    keyboard: true
  })
  CouponModal.value.addEventListener('shown.bs.modal', () => emit('shown'))
  CouponModal.value.addEventListener('hidden.bs.modal', () => emit('hidden'))
})

// 6) defineExpose內建語法不需 import,對外暴露方法給父層用 ref 呼叫
defineExpose({ show, hide, resetForm })

</script>
<template>
  <div class="modal fade" id="myModal" aria-hidden="true" ref="CouponModal">
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ form.id ? '編輯優惠券' : '新增優惠券' }}</span>
          </h5>
          <button type="button" class="btn-close"
                  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <input type="hidden" class="form-control" id="id" v-model="form.id">
            <div class="col">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input type="text" class="form-control" id="title" v-model="form.title"
                        placeholder="請輸入標題">
              </div>

            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="code" class="form-label">優惠碼</label>
              <input type="text" class="form-control" id="code" v-model="form.code"
                      placeholder="請輸入優惠碼">
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="percent" class="form-label">折扣</label>
              <input type="number" class="form-control" id="percent" v-model.number="form.percent"
                      placeholder="請輸入折扣">
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="due_date" class="form-label">期限</label>
              <input type="datetime-local" class="form-control" id="due_date" v-model="form.due_date"
                      placeholder="請輸入期限">
            </div>
          </div>
          <div class="row mt-3 ps-3">
            <div class="col form-check">
              <input class="form-check-input" type="checkbox"
                      v-model="form.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled" >
              <label class="form-check-label" for="is_enabled">
                是否啟用
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="onCancel">取消
          </button>
          <button type="button" class="btn btn-primary" @click="onSave">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>
