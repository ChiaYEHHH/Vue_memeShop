import { ref } from 'vue'

/**
 * 通用 Toast 消息 Composable
 * @returns {Object} 包含 toast 消息管理
 */
export function useToastMessage() {
  const toastMsg = ref({})

  /**
   * 顯示成功提示
   * @param {string} title - 標題
   * @param {string} content - 內容
   */
  const showSuccess = (title = '成功', content = '操作成功') => {
    toastMsg.value = {
      title,
      content,
      style: 'success',
    }
  }

  /**
   * 顯示錯誤提示
   * @param {string} title - 標題
   * @param {string} content - 內容
   */
  const showError = (title = '錯誤', content = '發生錯誤，請重試') => {
    toastMsg.value = {
      title,
      content,
      style: 'danger',
    }
  }

  /**
   * 顯示自定義提示
   * @param {Object} options - { title, content, style }
   */
  const showMessage = (options = {}) => {
    toastMsg.value = {
      title: options.title || '',
      content: options.content || '',
      style: options.style || 'danger',
    }
  }

  /**
   * 清除提示
   */
  const clearMessage = () => {
    toastMsg.value = {}
  }

  return {
    toastMsg,
    showSuccess,
    showError,
    showMessage,
    clearMessage,
  }
}
