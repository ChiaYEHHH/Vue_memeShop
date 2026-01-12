<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utilss/api'
import dayjs from 'dayjs'
import couponModal from '@/components/couponModal.vue'
import deleteModal from '@/components/deleteModal.vue'
import msgToast from '@/components/msgToast.vue'
import pageSwitch from '@/components/pageSwitch.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const router = useRouter()
const couponList = ref([])
const pages = ref({})
const currentPage = ref(1)
const tempCoupon = ref(null)
const couponModalRef = ref(null)
const deleteModalRef = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const toastMsg = ref({})

const couponAllList = async (page = 1) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    // ⭐ 步驟 1: 先取得 token
    // 正確的 cookie 解析方式
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1]
    // ⭐ 步驟 2: 檢查 token 是否存在
    if (!token) {
      console.error('❌ 沒有找到 token')
      errorMessage.value = '請先登入'
      router.push('/login')
      return
    }
    // ⭐ 步驟 3: 驗證 token 是否存在
    // `api` 的請求攔截器會自動把 token 加到 Authorization header，所以這裡不需要手動設置
    // console.log('2. Authorization Header 將由 api 攔截器自動處理')

    // ⭐ 步驟 4: 建構 API 相對路徑並加入分頁參數（讓 api.baseURL 生效）
    const couponsList = `v2/api/${import.meta.env.VITE_API_PATH}/admin/coupons`

    // ⭐ 步驟 5: 使用已配置好的 `api` 發送 GET 請求（包含 timeout & Authorization 攔截器）
    const resAuth = await api.get(couponsList)
    // console.log(`output->resAuth`,resAuth)
    if (resAuth.data.success) {
      couponList.value = resAuth.data.coupons
      // 將每個優惠券的 due_date（timestamp）轉換成 datetime-local 格式用於編輯表單
      couponList.value.forEach((coupon) => {
        if (coupon.due_date) {
          // 使用 dayjs 將 timestamp 轉換為本地時區的 datetime-local 格式
          coupon.due_date = dayjs(coupon.due_date).tz('Asia/Taipei').format('YYYY/MM/DD HH:mm')
        }
      })
      pages.value = resAuth.data.pagination
      currentPage.value = page
      isLoading.value = false
    } else {
      errorMessage.value = '無法取得優惠卷資料'
      isLoading.value = false
    }
    console.log(`output->couponList1`, couponList.value)
  } catch (error) {
    console.error('錯誤詳情:', error.response?.data)

    isLoading.value = false
  }
}

const addCoupon = () => {
  console.log('新增優惠卷')
  // TODO: 實作新增產品功能
  tempCoupon.value = null
  couponModalRef.value.show() // 新增：清空並開啟
}

const editItem = (item) => {
  tempCoupon.value = item
  console.log(item)
  couponModalRef.value.show(item) // 編輯：載入 item 並開啟
}

const delItem = (item) => {
  tempCoupon.value = item
  console.log(item)
  // 開啟刪除 Modal
  deleteModalRef.value.show(item)
}

const handleDelete = async (item) => {
  const delcoupon = `v2/api/${import.meta.env.VITE_API_PATH}/admin/coupon/${item.id}`
  const delResult = await api.delete(delcoupon)
  console.log(`output->delResult`, delResult)
  if (delResult.data.success) {
    toastMsg.value = { title: '刪除成功', content: delResult.data.message, style: 'success' }
    console.log('刪除成功')
    await couponAllList(currentPage.value)
  } else {
    toastMsg.value = { title: '刪除失敗', content: delResult.data.message, style: 'danger' }
    console.log('刪除失敗')
  }
}

const handleSave = async (payload) => {
  tempCoupon.value = payload
  isLoading.value = true
  // const saveApi = "";
  try {
    let resHandleSave = null
    const saveData = { data: tempCoupon.value }
    console.log(`tempCoupon.value`, tempCoupon.value)
    if (tempCoupon.value.id) {
      // 編輯更新
      const editRrl = `v2/api/${import.meta.env.VITE_API_PATH}/admin/coupon/${tempCoupon.value.id}`
      resHandleSave = await api.put(editRrl, saveData)
      // msgToast.title = "更新成功";
      // msgToast.content = resHandleSave.data.message;
    } else {
      // 新增
      const addApi = `v2/api/${import.meta.env.VITE_API_PATH}/admin/coupon`
      resHandleSave = await api.post(addApi, saveData)
      // msgToast.title = "新增成功";
      // msgToast.content = resHandleSave.data.message;
    }
    if (resHandleSave.data.success) {
      console.log('save success')

      toastMsg.value = {
        title: resHandleSave.data.message,
        content: resHandleSave.data.message,
        style: 'success',
      }
      await couponAllList(currentPage.value)
    }
  } catch (error) {
    console.log('save fail', error)
  } finally {
    isLoading.value = false
  }
}

// 組件掛載時檢查認證
onMounted(() => {
  couponAllList(currentPage.value)
})
</script>

<template>
  <loading :active="isLoading" :is-full-page="true" />
  <msg-toast :msg="toastMsg" />
  <div class="text-end p-3">
    <button type="button" class="btn btn-primary" @click="addCoupon">新增</button>
  </div>
  <table class="table table-hover">
    <thead class="table-light">
      <tr>
        <th>優惠名稱</th>
        <th width="120">折扣碼</th>
        <th width="120">折扣</th>
        <th width="200">使用期限</th>
        <th class="text-center" width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in couponList"
        :key="item.id"
      >
        <td>{{ item.title }}</td>
        <td>{{ item.code }}</td>
        <td class="text-start">{{ item.percent }}%</td>
        <td class="text-start">{{ item.due_date }}</td>
        <td class="text-center">
          <!-- <span class="badge" :class="item.is_enabled ? 'bg-success' : 'bg-secondary'">
            {{ item.is_enabled ? '啟用' : '未啟用' }}
          </span> -->
          <span class="badge bg-success" v-if="item.is_enabled">啟用</span>
          <span class="badge bg-secondary" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click="editItem(item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="delItem(item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <page-switch :pages="pages" @change-page="couponAllList" />

  <coupon-modal ref="couponModalRef" :coupon="tempCoupon" @save="handleSave" />
  <delete-modal ref="deleteModalRef" :delItem="tempCoupon" @delete="handleDelete" />
</template>
