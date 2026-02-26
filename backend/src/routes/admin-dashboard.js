import express from 'express'
import prisma from '../utils/prisma.js'
import authMiddleware, { adminOnly } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats  
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // 並行查詢所有統計數據
    const [
      totalOrders,
      todayOrders,
      yesterdayOrders,
      totalRevenue,
      todayRevenue,
      yesterdayRevenue,
      pendingOrders,
      totalMembers,
      newMembersThisMonth
    ] = await Promise.all([
      // 總訂單數
      prisma.order.count(),
      // 今日訂單數
      prisma.order.count({
        where: {
          createdAt: { gte: today }
        }
      }),
      // 昨日訂單數
      prisma.order.count({
        where: {
          createdAt: {
            gte: yesterday,
            lt: today
          }
        }
      }),
      // 總營業額
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED'
        },
        _sum: { totalAmount: true }
      }),
      // 今日營業額
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: { gte: today }
        },
        _sum: { totalAmount: true }
      }),
      // 昨日營業額
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: {
            gte: yesterday,
            lt: today
          }
        },
        _sum: { totalAmount: true }
      }),
      // 待處理訂單
      prisma.order.count({
        where: {
          status: { in: ['PENDING', 'PAID'] }
        }
      }),
      // 總會員數
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),
      // 本月新會員
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), 1)
          }
        }
      })
    ])

    // 計算變化率
    const ordersChange = yesterdayOrders === 0 ? 100 : 
      ((todayOrders - yesterdayOrders) / yesterdayOrders * 100)
    
    const revenueChange = (yesterdayRevenue?._sum?.totalAmount || 0) === 0 ? 100 :
      (((todayRevenue?._sum?.totalAmount || 0) - (yesterdayRevenue?._sum?.totalAmount || 0)) / (yesterdayRevenue?._sum?.totalAmount || 0) * 100)

    const stats = [
      {
        title: '今日訂單',
        value: todayOrders,
        prefix: '',
        change: Number(ordersChange.toFixed(1)),
        icon: 'ShoppingBag',
        color: '#00d4ff',
        bgColor: 'rgba(0, 212, 255, 0.2)'
      },
      {
        title: '今日營業額',
        value: Number(todayRevenue?._sum?.totalAmount || 0),
        prefix: '$',
        change: Number(revenueChange.toFixed(1)),
        icon: 'TrendCharts',
        color: '#00ffaa',
        bgColor: 'rgba(0, 255, 170, 0.2)'
      },
      {
        title: '待處理訂單',
        value: pendingOrders,
        prefix: '',
        change: 0,
        icon: 'Clock',
        color: '#ffaa00',
        bgColor: 'rgba(255, 170, 0, 0.2)'
      },
      {
        title: '會員總數',
        value: totalMembers,
        prefix: '',
        change: Number(((newMembersThisMonth / Math.max(totalMembers - newMembersThisMonth, 1)) * 100).toFixed(1)),
        icon: 'UserFilled',
        color: '#8a2be2',
        bgColor: 'rgba(138, 43, 226, 0.2)'
      }
    ]

    res.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Get dashboard stats error:', error)
    res.status(500).json({
      success: false,
      message: '獲取統計數據失敗'
    })
  }
})

// @desc    Get sales chart data
// @route   GET /api/admin/dashboard/sales-chart
// @access  Admin
router.get('/sales-chart', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { period = '7' } = req.query
    const days = parseInt(period)
    
    const chartData = []
    const labels = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      const dayRevenue = await prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: {
            gte: date,
            lt: nextDay
          }
        },
        _sum: { totalAmount: true }
      })
      
      chartData.push(Number(dayRevenue._sum.totalAmount || 0))
      labels.push((date.getMonth() + 1) + '/' + date.getDate())
    }

    res.json({
      success: true,
      data: {
        labels,
        datasets: [{
          label: '銷售額',
          data: chartData,
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      }
    })

  } catch (error) {
    console.error('Get sales chart error:', error)
    res.status(500).json({
      success: false,
      message: '獲取銷售圖表失敗'
    })
  }
})

// @desc    Get category sales chart
// @route   GET /api/admin/dashboard/category-chart
// @access  Admin
router.get('/category-chart', authMiddleware, adminOnly, async (req, res) => {
  try {
    const categoryStats = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        name: true,
        products: {
          select: {
            orderItems: {
              select: {
                quantity: true,
                order: {
                  select: {
                    paymentStatus: true
                  }
                }
              }
            }
          }
        }
      }
    })

    const labels = []
    const data = []
    const backgroundColor = [
      '#00d4ff', '#00ffaa', '#ffaa00', '#8a2be2', '#ff6b6b', '#4ecdc4'
    ]

    categoryStats.forEach((category, index) => {
      const totalSold = category.products.reduce((sum, product) => {
        return sum + product.orderItems.reduce((itemSum, item) => {
          return item.order.paymentStatus === 'COMPLETED' ? itemSum + item.quantity : itemSum
        }, 0)
      }, 0)

      if (totalSold > 0) {
        labels.push(category.name)
        data.push(totalSold)
      }
    })

    res.json({
      success: true,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: backgroundColor.slice(0, labels.length)
        }]
      }
    })

  } catch (error) {
    console.error('Get category chart error:', error)
    res.status(500).json({
      success: false,
      message: '獲取分類圖表失敗'
    })
  }
})

// @desc    Get recent orders
// @route   GET /api/admin/dashboard/recent-orders
// @access  Admin
router.get('/recent-orders', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { limit = 5 } = req.query

    const orders = await prisma.order.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: `${order.user.firstName} ${order.user.lastName}`,
      amount: Number(order.totalAmount),
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString()
    }))

    res.json({
      success: true,
      data: formattedOrders
    })

  } catch (error) {
    console.error('Get recent orders error:', error)
    res.status(500).json({
      success: false,
      message: '獲取最新訂單失敗'
    })
  }
})

// @desc    Get top selling products
// @route   GET /api/admin/dashboard/top-products
// @access  Admin  
router.get('/top-products', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { limit = 5 } = req.query

    const products = await prisma.product.findMany({
      take: parseInt(limit),
      orderBy: { salesCount: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        salesCount: true,
        images: {
          take: 1,
          select: { url: true }
        }
      }
    })

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      sales: product.salesCount,
      image: product.images[0]?.url || ''
    }))

    res.json({
      success: true,
      data: formattedProducts
    })

  } catch (error) {
    console.error('Get top products error:', error)
    res.status(500).json({
      success: false,
      message: '獲取熱銷商品失敗'
    })
  }
})

export default router