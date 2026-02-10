import dayjs from 'dayjs'

/**
 * 優惠券日期格式轉換 Composable
 * @returns {Object} 包含日期轉換方法
 */
export function useCouponDateFormat() {
  /**
   * 將時間戳轉換為 datetime-local 格式
   * @param {number} timestamp - 毫秒時間戳
   * @returns {string} YYYY-MM-DDTHH:mm 格式
   */
  const formatTimestampToLocal = (timestamp) => {
    if (!timestamp) return ''
    return dayjs(timestamp).tz('Asia/Taipei').format('YYYY-MM-DDTHH:mm')
  }

  /**
   * 將 datetime-local 格式轉換為時間戳
   * @param {string} dateTimeLocal - YYYY-MM-DDTHH:mm 格式
   * @returns {number} 毫秒時間戳
   */
  const formatLocalToTimestamp = (dateTimeLocal) => {
    if (!dateTimeLocal) return null
    return dayjs(dateTimeLocal, 'YYYY-MM-DDTHH:mm').tz('Asia/Taipei').valueOf()
  }

  /**
   * 批量轉換優惠券列表的日期格式
   * @param {Array} coupons - 優惠券列表
   * @returns {Array} 轉換後的優惠券列表
   */
  const convertCouponDatesToLocal = (coupons) => {
    return coupons.map((coupon) => ({
      ...coupon,
      due_date: coupon.due_date ? formatTimestampToLocal(coupon.due_date) : '',
    }))
  }

  return {
    formatTimestampToLocal,
    formatLocalToTimestamp,
    convertCouponDatesToLocal,
  }
}
