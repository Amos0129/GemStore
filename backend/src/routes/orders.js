import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// 獲取所有訂單
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search,
      startDate,
      endDate 
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // 建立篩選條件
    const where = {}
    
    if (status) {
      where.status = status.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { 
          user: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      ]
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    // 獲取訂單資料
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: {
                  where: { isMain: true },
                  select: { url: true, alt: true }
                }
              }
            }
          }
        },
        shippingAddress: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    })

    // 計算總數
    const totalCount = await prisma.order.count({ where })

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('獲取訂單失敗:', error)
    res.status(500).json({
      success: false,
      message: '獲取訂單失敗',
      error: error.message
    })
  }
})

// 獲取訂單統計
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await prisma.order.count()
    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: {
          in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
        }
      },
      _sum: {
        totalAmount: true
      }
    })
    
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    })

    const avgOrderValue = totalOrders > 0 
      ? (totalRevenue._sum.totalAmount || 0) / totalOrders 
      : 0

    res.json({
      success: true,
      data: {
        total: totalOrders,
        revenue: totalRevenue._sum.totalAmount || 0,
        pending: pendingOrders,
        avgOrder: Math.round(avgOrderValue)
      }
    })
  } catch (error) {
    console.error('獲取統計資料失敗:', error)
    res.status(500).json({
      success: false,
      message: '獲取統計資料失敗',
      error: error.message
    })
  }
})

// 獲取單一訂單詳情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: {
                  where: { isMain: true },
                  select: { url: true, alt: true }
                }
              }
            }
          }
        },
        shippingAddress: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '訂單不存在'
      })
    }

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('獲取訂單詳情失敗:', error)
    res.status(500).json({
      success: false,
      message: '獲取訂單詳情失敗',
      error: error.message
    })
  }
})

// 更新訂單狀態
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status, note } = req.body

    // 檢查訂單是否存在
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: '訂單不存在'
      })
    }

    // 更新訂單狀態
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        ...(status.toUpperCase() === 'SHIPPED' && { shippedAt: new Date() }),
        ...(status.toUpperCase() === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(status.toUpperCase() === 'CANCELLED' && { cancelledAt: new Date() }),
        statusHistory: {
          create: {
            status: status.toUpperCase(),
            note: note || `訂單狀態更改為${status}`
          }
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: updatedOrder,
      message: '訂單狀態更新成功'
    })
  } catch (error) {
    console.error('更新訂單狀態失敗:', error)
    res.status(500).json({
      success: false,
      message: '更新訂單狀態失敗',
      error: error.message
    })
  }
})

export default router