import { ref } from 'vue'
import api from '@/utilss/api'

/**
 * 通用保存操作 Composable
 * @param {string} resourceType - 資源類型（如 'product', 'coupon'）
 * @param {Function} onSuccess - 保存成功後的回調
 * @param {Object} externalToastMsg - 外部 toast 消息 ref（可選）
 * @returns {Object} 包含保存邏輯和 toast 消息
 *
 * 使用示例:
 * const { toastMsg, handleSave } = useSaveHandler('product', () => fetchList(), externalToastMsg)
 */
export function useSaveHandler(resourceType = 'product', onSuccess = null,  options = {}) {
  const internalToastMsg = ref({})
  // 傳入一個 options 物件：{ externalToastMsg: toastRef }
  const toastMsg = options.externalToastMsg || internalToastMsg
  const isLoading = ref(false)

  const handleSave = async (payload) => {
    isLoading.value = true
    try {
      let response = null
      const baseUrl = `v2/api/${import.meta.env.VITE_API_PATH}/${resourceType}`

      if (payload.id) {
        // 更新現有項目
        const url = `${baseUrl}/${payload.id}`
        response = await api.put(url, { data: payload })
      } else {
        // 創建新項目
        response = await api.post(baseUrl, { data: payload })
      }

      toastMsg.value = {
        title: response.data.message,
        content: response.data.message,
      }

      if (response.data.success) {
        toastMsg.value.style = 'success'
        if (onSuccess && typeof onSuccess === 'function') {
          await onSuccess(payload)
        }
      } else {
        toastMsg.value.style = 'danger'
      }
    } catch (error) {
      toastMsg.value = {
        title: '保存錯誤',
        content: error.response?.data?.message?.[0] || error.message || '發生錯誤，請重試',
        style: 'danger',
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    toastMsg,
    isLoading,
    handleSave,
  }
}
