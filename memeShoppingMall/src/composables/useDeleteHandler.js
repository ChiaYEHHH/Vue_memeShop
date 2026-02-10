import { ref } from 'vue'
import api from '@/utilss/api'

/**
 * 使用範例：
 * const { toastMsg, handleDelete } = useDeleteHandler(
 *   `/admin/orders/:id`,
 *   () => fetchList(),
 *   { externalToastMsg: toastMsg }
 * )
 * await handleDelete(null, { all: true }) // 刪除 /admin/orders/all
 *
 * const { toastMsg, handleDelete } = useDeleteHandler(
 *   `/cart/:id`,
 *   null,
 *   { externalToastMsg: toastMsg }
 * )
 * await handleDelete(item) // 刪除 /cart/:id
 */
export function useDeleteHandler(resourcePath, onSuccess = null, options = {}) {
  const internalToastMsg = ref({})
  const toastMsg = options.externalToastMsg || internalToastMsg

  const base = `v2/api/${import.meta.env.VITE_API_PATH}`

  const buildUrl = (itemOrId, opts = {}) => {
    if (opts.customTail) {
      return `${base}/${resourcePath}/${opts.customTail.replace(':id', (typeof itemOrId === 'object' ? itemOrId?.id : itemOrId))}`
    }

    if (opts.all) {
      return `${base}/${resourcePath}/all`
    }

    const id = typeof itemOrId === 'object' ? itemOrId?.id : itemOrId
    if (!id) {
      return `${base}/${resourcePath}`
    }
    return `${base}/${resourcePath}/${id}`
  }

  const handleDelete = async (itemOrId, opts = {}) => {
    try {
      const url = buildUrl(itemOrId, opts)
      const result = await api.delete(url)

      toastMsg.value = {
        title: result.data?.message || '刪除完成',
        content: result.data?.message || '',
      }

      if (result.data?.success) {
        toastMsg.value.style = 'success'
        if (onSuccess && typeof onSuccess === 'function') {
          await onSuccess(itemOrId)
        }
      } else {
        toastMsg.value.style = 'danger'
      }
    } catch (error) {
      toastMsg.value = {
        title: '刪除錯誤',
        content: error.response?.data?.message?.[0] || error.message || '發生錯誤，請重試',
        style: 'danger',
      }
    }
  }

  return {
    toastMsg,
    handleDelete,
  }
}
