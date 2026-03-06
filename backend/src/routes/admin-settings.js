import express from 'express'
import prisma from '../utils/prisma.js'
import authMiddleware, { adminOnly } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get all system settings
// @route   GET /api/admin/settings
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.systemSetting.findMany()
    
    // 將設定轉換為物件格式
    const settingsObject = {}
    settings.forEach(setting => {
      try {
        settingsObject[setting.key] = JSON.parse(setting.value)
      } catch {
        settingsObject[setting.key] = setting.value
      }
    })

    // 提供預設設定
    const defaultSettings = {
      basicSettings: {
        siteName: '晶礦飾品',
        siteDescription: '精選天然水晶飾品，為您帶來能量與美麗',
        customerServicePhone: '0800-123-456',
        customerServiceEmail: 'service@crystal-jewelry.com',
        companyAddress: '台北市信義區信義路五段7號',
        logoUrl: null
      },
      storeSettings: {
        defaultCurrency: 'TWD',
        freeShippingThreshold: 1500,
        shippingFee: 150,
        taxRate: 5.0,
        lowStockThreshold: 10,
        autoConfirmOrders: true,
        allowGuestCheckout: true
      },
      paymentSettings: {
        methods: ['CREDIT_CARD', 'BANK_TRANSFER', 'LINE_PAY'],
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
      notificationSettings: {
        newOrder: true,
        lowStock: true,
        newMember: false,
        newReview: true,
        email: 'admin@crystal-jewelry.com',
        lineToken: ''
      },
      seoSettings: {
        title: '晶礦飾品 - 精選天然水晶飾品',
        description: '專業水晶飾品購物網站，提供項鍊、手鍊、戒指、耳環等各式天然水晶飾品',
        keywords: '水晶,飾品,項鍊,手鍊,戒指,耳環,天然水晶',
        googleAnalytics: '',
        facebookPixel: '',
        googleTagManager: ''
      }
    }

    // 合併預設設定和資料庫設定
    const finalSettings = { ...defaultSettings, ...settingsObject }

    res.json({
      success: true,
      data: finalSettings
    })

  } catch (error) {
    console.error('Get settings error:', error)
    res.status(500).json({
      success: false,
      message: '獲取系統設定失敗'
    })
  }
})

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Admin
router.put('/', async (req, res) => {
  try {
    const { category, settings } = req.body

    if (!category || !settings) {
      return res.status(400).json({
        success: false,
        message: '缺少必要參數'
      })
    }

    // 更新或創建設定
    await prisma.systemSetting.upsert({
      where: { key: category },
      update: { 
        value: JSON.stringify(settings),
        updatedAt: new Date()
      },
      create: {
        key: category,
        value: JSON.stringify(settings)
      }
    })

    res.json({
      success: true,
      message: '設定更新成功'
    })

  } catch (error) {
    console.error('Update settings error:', error)
    res.status(500).json({
      success: false,
      message: '更新設定失敗'
    })
  }
})

// @desc    Get system information
// @route   GET /api/admin/settings/system-info
// @access  Admin
router.get('/system-info', async (req, res) => {
  try {
    // 獲取基本統計數據
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalCategories
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.category.count()
    ])

    // 模擬系統資訊
    const systemInfo = {
      version: '1.0.0',
      database: 'PostgreSQL 14',
      node: process.version,
      server: 'Docker Container',
      disk: '2.5 GB / 50 GB (5%)',
      memory: '512 MB / 2 GB (25%)',
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-TW'),
      uptime: Math.floor(process.uptime() / 3600) + ' 小時',
      stats: {
        users: totalUsers,
        orders: totalOrders,
        products: totalProducts,
        categories: totalCategories
      }
    }

    res.json({
      success: true,
      data: systemInfo
    })

  } catch (error) {
    console.error('Get system info error:', error)
    res.status(500).json({
      success: false,
      message: '獲取系統資訊失敗'
    })
  }
})

// @desc    Clear system cache
// @route   POST /api/admin/settings/clear-cache
// @access  Admin
router.post('/clear-cache', async (req, res) => {
  try {
    // 實際上這裡可以清除Redis快取、檔案快取等
    // 現在只是模擬
    
    res.json({
      success: true,
      message: '快取清除成功'
    })

  } catch (error) {
    console.error('Clear cache error:', error)
    res.status(500).json({
      success: false,
      message: '清除快取失敗'
    })
  }
})

// @desc    Backup system
// @route   POST /api/admin/settings/backup
// @access  Admin
router.post('/backup', async (req, res) => {
  try {
    // 實際上這裡會執行資料庫備份
    // 現在只是模擬
    
    const backupFile = `backup_${new Date().toISOString().split('T')[0]}.sql`
    
    res.json({
      success: true,
      message: '備份已開始',
      data: { filename: backupFile }
    })

  } catch (error) {
    console.error('Backup system error:', error)
    res.status(500).json({
      success: false,
      message: '系統備份失敗'
    })
  }
})

// @desc    Get public settings (for frontend)
// @route   GET /api/settings/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: ['paymentSettings', 'shippingSettings', 'storeSettings']
        }
      }
    })
    
    // 將設定轉換為物件格式
    const settingsObject = {}
    settings.forEach(setting => {
      try {
        settingsObject[setting.key] = JSON.parse(setting.value)
      } catch {
        settingsObject[setting.key] = setting.value
      }
    })

    // 提供預設設定
    const defaultSettings = {
      paymentSettings: {
        methods: ['CREDIT_CARD', 'BANK_TRANSFER', 'LINE_PAY'],
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
        taxRate: 5.0,
        lowStockThreshold: 10,
        autoConfirmOrders: true,
        allowGuestCheckout: true
      }
    }

    // 合併預設設定和資料庫設定
    const finalSettings = { ...defaultSettings, ...settingsObject }

    res.json({
      success: true,
      data: finalSettings
    })

  } catch (error) {
    console.error('Get public settings error:', error)
    res.status(500).json({
      success: false,
      message: '獲取系統設定失敗'
    })
  }
})

export default router