import express from 'express'
import prisma from '../utils/prisma.js'
import authMiddleware, { adminOnly } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get admin notifications
// @route   GET /api/admin/notifications
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, unreadOnly = false } = req.query
    
    const offset = (parseInt(page) - 1) * parseInt(limit)
    
    const where = {}
    if (unreadOnly === 'true') {
      where.isRead = false
    }

    const [notifications, unreadCount, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.notification.count({
        where: { isRead: false }
      }),
      prisma.notification.count({ where })
    ])

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    })

  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({
      success: false,
      message: '獲取通知失敗'
    })
  }
})

// @desc    Mark notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Admin
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params

    const notification = await prisma.notification.update({
      where: { id },
      data: { 
        isRead: true,
        readAt: new Date()
      }
    })

    res.json({
      success: true,
      message: '通知已標記為已讀',
      data: notification
    })

  } catch (error) {
    console.error('Mark notification as read error:', error)
    res.status(500).json({
      success: false,
      message: '標記通知失敗'
    })
  }
})

// @desc    Mark all notifications as read
// @route   PUT /api/admin/notifications/read-all
// @access  Admin
router.put('/read-all', async (req, res) => {
  try {
    const result = await prisma.notification.updateMany({
      where: { isRead: false },
      data: { 
        isRead: true,
        readAt: new Date()
      }
    })

    res.json({
      success: true,
      message: `已標記 ${result.count} 個通知為已讀`
    })

  } catch (error) {
    console.error('Mark all notifications as read error:', error)
    res.status(500).json({
      success: false,
      message: '標記所有通知失敗'
    })
  }
})

// @desc    Delete notification
// @route   DELETE /api/admin/notifications/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.notification.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: '通知已刪除'
    })

  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({
      success: false,
      message: '刪除通知失敗'
    })
  }
})

// @desc    Create test notifications (for development)
// @route   POST /api/admin/notifications/create-test
// @access  Admin
router.post('/create-test', async (req, res) => {
  try {
    const testNotifications = [
      {
        type: 'ORDER_CREATED',
        title: '新訂單通知',
        message: '您有一筆新訂單 #ORD-2026-011 需要處理',
        data: { orderId: 'test-order-1' }
      },
      {
        type: 'LOW_STOCK',
        title: '庫存警告',
        message: '商品「紫水晶能量項鍊」庫存不足，剩餘 3 件',
        data: { productId: 'test-product-1' }
      },
      {
        type: 'SYSTEM_ALERT',
        title: '系統維護通知',
        message: '系統將於今晚 23:00 進行例行維護',
        data: {}
      },
      {
        type: 'NEW_REVIEW',
        title: '新評價',
        message: '商品「粉晶愛情手鍊」收到一條新評價',
        data: { reviewId: 'test-review-1' }
      },
      {
        type: 'PAYMENT_SUCCESS',
        title: '付款成功',
        message: '訂單 #ORD-2026-012 付款已完成',
        data: { orderId: 'test-order-2' }
      }
    ]

    const notifications = await Promise.all(
      testNotifications.map(notification =>
        prisma.notification.create({ data: notification })
      )
    )

    res.json({
      success: true,
      message: '測試通知創建成功',
      data: { count: notifications.length }
    })

  } catch (error) {
    console.error('Create test notifications error:', error)
    res.status(500).json({
      success: false,
      message: '創建測試通知失敗'
    })
  }
})

export default router