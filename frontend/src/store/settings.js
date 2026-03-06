import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({
    paymentSettings: {
      methods: ['credit_card', 'bank_transfer', 'line_pay'],
      creditCardFee: 2.75,
      paypalFee: 3.4,
      bankAccount: '123-456-789-012',
      bankName: '中國信託銀行'
    },
    shippingSettings: {
      methods: ['home_delivery', 'convenience_store'],
      homeDeliveryFee: 150,
      convenienceStoreFee: 60,
      estimatedDays: 3,
      returnDays: 7
    },
    storeSettings: {
      defaultCurrency: 'TWD',
      freeShippingThreshold: 1500,
      shippingFee: 150,
      taxRate: 5.0
    }
  })

  const isLoading = ref(false)

  const fetchSettings = async () => {
    try {
      isLoading.value = true
      const response = await fetch('http://localhost:5000/api/settings/public')
      const data = await response.json()
      
      if (data?.success) {
        settings.value = data.data
      }
    } catch (error) {
      console.error('獲取系統設定失敗:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 獲取可用的付款方式
  const availablePaymentMethods = computed(() => {
    const methods = settings.value.paymentSettings?.methods || []
    const methodsMap = {
      'CREDIT_CARD': { value: 'credit-card', label: '信用卡', fee: settings.value.paymentSettings?.creditCardFee || 0 },
      'BANK_TRANSFER': { value: 'bank-transfer', label: '銀行轉帳', fee: 0 },
      'PAYPAL': { value: 'paypal', label: 'PayPal', fee: settings.value.paymentSettings?.paypalFee || 0 },
      'CASH_ON_DELIVERY': { value: 'cod', label: '貨到付款', fee: 0 },
      'LINE_PAY': { value: 'line-pay', label: 'LINE Pay', fee: 0 }
    }
    
    return methods.map(method => methodsMap[method]).filter(Boolean)
  })

  // 獲取可用的配送方式
  const availableShippingMethods = computed(() => {
    const methods = settings.value.shippingSettings?.methods || []
    const methodsMap = {
      'home_delivery': { 
        value: 'home_delivery', 
        label: '宅配到府', 
        fee: settings.value.shippingSettings?.homeDeliveryFee || 150,
        description: `預計 ${settings.value.shippingSettings?.estimatedDays || 3} 個工作天送達`
      },
      'convenience_store': { 
        value: 'convenience_store', 
        label: '超商取貨', 
        fee: settings.value.shippingSettings?.convenienceStoreFee || 60,
        description: '7-11、全家便利商店取貨'
      },
      'post_office': { 
        value: 'post_office', 
        label: '郵局取貨', 
        fee: 50,
        description: '中華郵政全國據點取貨'
      },
      'self_pickup': { 
        value: 'self_pickup', 
        label: '門市自取', 
        fee: 0,
        description: '免運費，營業時間內取貨'
      }
    }
    
    return methods.map(method => methodsMap[method]).filter(Boolean)
  })

  // 計算運費
  const calculateShippingFee = (method, totalPrice) => {
    const freeShippingThreshold = settings.value.storeSettings?.freeShippingThreshold || 1500
    
    // 超過免運門檻且不是自取
    if (totalPrice >= freeShippingThreshold && method !== 'self_pickup') {
      return 0
    }
    
    const shippingMethod = availableShippingMethods.value.find(m => m.value === method)
    return shippingMethod?.fee || 0
  }

  // 計算手續費
  const calculatePaymentFee = (method, totalPrice) => {
    const paymentMethod = availablePaymentMethods.value.find(m => m.value === method)
    if (!paymentMethod || !paymentMethod.fee) return 0
    
    return Math.round(totalPrice * (paymentMethod.fee / 100))
  }

  return {
    settings,
    isLoading,
    fetchSettings,
    availablePaymentMethods,
    availableShippingMethods,
    calculateShippingFee,
    calculatePaymentFee
  }
})