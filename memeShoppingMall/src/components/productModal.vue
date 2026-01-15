<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'
import axios from 'axios'


// 1) 接收外部 product 當編輯初值
const props = defineProps({
  product: {
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
  unit: '',
  price: '',
  origin_price: '',
  description: '',
  content: '',
  category: '',
  imageUrl: '',
  images: [],
  is_enabled: '',
  customFile: ''
})

// 4) Modal 實體
const ProductModal = ref(null)
let modalInstance = null

// 5) 當外部 product 變更 → 寫入本地表單
watch(
  () => props.product,
  (val) => {
    if (val) {
      form.id = val.id ?? ''
      form.title = val.title ?? ''
      form.unit = val.unit ?? ''
      form.price = val.price ?? ''
      form.origin_price = val.origin_price ?? ''
      form.description = val.description ?? ''
      form.content = val.content ?? ''
      form.category = val.category ?? ''
      form.imageUrl = val.imageUrl ?? ''
      form.images = val.imagesUrl ?? []
      form.is_enabled = val.is_enabled ?? ''
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
  form.unit = ''
  form.price = ''
  form.origin_price = ''
  form.description = ''
  form.content = ''
  form.category = ''
  form.imageUrl = ''
  form.images = []
  form.is_enabled = ''
  form.customFile = ''
}

function show () {
  // 如果父層傳入 product（例如編輯情境）
  if (props.product && props.product.id) {
    // console.log("props.product",props.product.title);
    form.id = props.product.id??''
    form.title = props.product.title??''
    form.unit = props.product.unit??''
    form.price = props.product.price??null
    form.origin_price = props.product.origin_price??null
    form.description = props.product.description??''
    form.content = props.product.content??''
    form.category = props.product.category??''
    form.imageUrl = props.product.imageUrl??''
    form.images = props.product.imagesUrl??[]
    form.is_enabled = props.product.is_enabled??0
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
  // 這裡可做驗證
  console.log(form);
  emit('save', { ...form })
  hide()
}

function onCancel () {
  emit('cancel')
  hide()
}

const uploadFile = async () => {
  const fileInput = document.getElementById('customFile')
  const file = fileInput.files[0]
  // console.log(`output->file`,file)
  if (file) {
    const formData = new FormData();
    formData.append('file-to-upload', file)
    const uploadImgUrl = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/upload`
    await axios.post(uploadImgUrl, formData)
      .then((response) => {
        console.log('上傳成功:', response.data)
        form.imageUrl = response.data.imageUrl
        fileInput.value = ''  // 清空檔案輸入欄位
      })
      .catch((error) => {
        console.error('上傳失敗:', error)
      })
  }
}

// 新增圖片欄位
const addImg = () => {
  form.images.push('') // 新增一個空字串
}

// 移除圖片
const removeImg = (index) => {
  form.images.splice(index, 1)
}

onMounted(() => {
  // 正確初始化 Bootstrap Modal
  modalInstance = new Modal(ProductModal.value, {
    backdrop: 'static', // 依需求
    keyboard: true
  })
  ProductModal.value.addEventListener('shown.bs.modal', () => emit('shown'))
  ProductModal.value.addEventListener('hidden.bs.modal', () => emit('hidden'))
})

// 6) defineExpose內建語法不需 import,對外暴露方法給父層用 ref 呼叫
defineExpose({ show, hide, resetForm })

</script>
<template>
  <div class="modal fade" id="myModal" aria-hidden="true" ref="ProductModal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ form.id ? '編輯產品' : '新增產品' }}</span>
          </h5>
          <button type="button" class="btn-close"
                  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <input type="hidden" class="form-control" id="id" v-model="form.id">
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="image" class="form-label">輸入圖片網址</label>
                <input type="text" class="form-control" id="image" v-model="form.imageUrl"
                        placeholder="請輸入圖片連結">
              </div>
              <div class="mb-3">
                <label for="customFile" class="form-label">或 上傳圖片
                  <i class="fas fa-spinner fa-spin"></i>
                </label>
                <input type="file" id="customFile" class="form-control" ref="fileInput" @change="uploadFile">
              </div>
              <img class="img-fluid" alt="" :src="form.imageUrl">
              <!-- 延伸技巧，多圖 -->
              <div class="mt-5">
                <div class="mb-3 input-group" v-for="(img,key)  in form.images" :key="key">
                  <input type="url" class="form-control form-control"
                          v-model="form.images[key]"
                          placeholder="請輸入連結" >
                  <button type="button" class="btn btn-outline-danger" @click="removeImg(key)">
                    移除
                  </button>
                  <img class="img-fluid" alt="" :src="img" v-if="img">
                </div>
                <div>
                  <button type="button" class="btn btn-outline-primary btn-sm d-block w-100" @click="addImg">
                    新增圖片
                  </button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input type="text" class="form-control" id="title" v-model="form.title"
                        placeholder="請輸入標題">
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input type="text" class="form-control" id="category" v-model="form.category"
                          placeholder="請輸入分類">
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input type="text" class="form-control" id="unit" v-model="form.unit"
                          placeholder="請輸入單位">
                </div>
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input type="number" class="form-control" id="origin_price" v-model.number="form.origin_price"
                          placeholder="請輸入原價">
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input type="number" class="form-control" id="price" v-model.number="form.price"
                          placeholder="請輸入售價">
                </div>
              </div>
              <hr>

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea type="text" class="form-control" id="description" v-model="form.description"
                          placeholder="請輸入產品描述"></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea type="text" class="form-control" id="content" v-model="form.content"
                          placeholder="請輸入產品說明內容"></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
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
