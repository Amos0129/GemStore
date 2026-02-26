import express from 'express'
import prisma from '../utils/prisma.js'
import authMiddleware, { adminOnly } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get finance statistics
// @route   GET /api/admin/finance/stats
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const end = endDate ? new Date(endDate) : new Date()
    
    // 計算上期時間範圍
    const periodDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    const prevStart = new Date(start)
    prevStart.setDate(prevStart.getDate() - periodDays)
    const prevEnd = new Date(start)

    const [
      currentPeriod,
      previousPeriod,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      // 當期數據
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: {
            gte: start,
            lte: end
          }
        },
        _sum: { totalAmount: true },
        _count: { id: true },
        _avg: { totalAmount: true }
      }),
      // 上期數據
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: {
            gte: prevStart,
            lt: prevEnd
          }
        },
        _sum: { totalAmount: true },
        _count: { id: true }
      }),
      // 總訂單數
      prisma.order.count({
        where: { paymentStatus: 'COMPLETED' }
      }),
      // 總收入
      prisma.order.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { totalAmount: true }
      })
    ])

    // 計算變化率
    const revenueChange = previousPeriod._sum.totalAmount 
      ? ((currentPeriod._sum.totalAmount - previousPeriod._sum.totalAmount) / previousPeriod._sum.totalAmount * 100)
      : 100

    const ordersChange = previousPeriod._count.id 
      ? ((currentPeriod._count.id - previousPeriod._count.id) / previousPeriod._count.id * 100)
      : 100

    const avgOrderValue = currentPeriod._avg.totalAmount || 0
    const prevAvgOrderValue = previousPeriod._count.id > 0 
      ? (previousPeriod._sum.totalAmount / previousPeriod._count.id) 
      : 0
    const avgChange = prevAvgOrderValue 
      ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue * 100)
      : 100

    // 估算利潤 (假設毛利率60%)
    const netProfit = (currentPeriod._sum.totalAmount || 0) * 0.6
    const prevNetProfit = (previousPeriod._sum.totalAmount || 0) * 0.6
    const profitChange = prevNetProfit 
      ? ((netProfit - prevNetProfit) / prevNetProfit * 100)
      : 100

    res.json({
      success: true,
      data: {
        totalRevenue: Number(currentPeriod._sum.totalAmount || 0),
        revenueChange: Number(revenueChange.toFixed(1)),
        totalOrders: currentPeriod._count.id,
        ordersChange: Number(ordersChange.toFixed(1)),
        avgOrderValue: Number(avgOrderValue.toFixed(0)),
        avgChange: Number(avgChange.toFixed(1)),
        netProfit: Number(netProfit.toFixed(0)),
        profitChange: Number(profitChange.toFixed(1)),
        totalOrdersAllTime: totalOrders,
        totalRevenueAllTime: Number(totalRevenue._sum.totalAmount || 0)
      }
    })

  } catch (error) {
    console.error('Get finance stats error:', error)
    res.status(500).json({
      success: false,
      message: '獲取財務統計失敗'
    })
  }
})

// @desc    Get top selling products
// @route   GET /api/admin/finance/top-products
// @access  Admin
router.get('/top-products', async (req, res) => {
  try {
    const { limit = 5 } = req.query

    const topProducts = await prisma.product.findMany({
      take: parseInt(limit),
      orderBy: { salesCount: 'desc' },
      select: {
        name: true,
        salesCount: true,
        price: true,
        orderItems: {
          where: {
            order: {
              paymentStatus: 'COMPLETED'
            }
          },
          select: {
            quantity: true,
            total: true
          }
        }
      }
    })

    const formattedProducts = topProducts.map(product => {
      const revenue = product.orderItems.reduce((sum, item) => sum + Number(item.total), 0)
      return {
        name: product.name,
        sales: product.salesCount || 0,
        revenue: Math.round(revenue)
      }
    })

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

// @desc    Get monthly comparison
// @route   GET /api/admin/finance/monthly-comparison
// @access  Admin
router.get('/monthly-comparison', async (req, res) => {
  try {
    const monthlyData = []
    const currentDate = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1)
      
      const monthData = await prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: {
            gte: month,
            lt: nextMonth
          }
        },
        _sum: { totalAmount: true },
        _count: { id: true }
      })

      // 計算成長率 (與前一個月比較)
      let growth = 0
      if (monthlyData.length > 0) {
        const prevRevenue = monthlyData[monthlyData.length - 1].revenue
        const currentRevenue = Number(monthData._sum.totalAmount || 0)
        if (prevRevenue > 0) {
          growth = ((currentRevenue - prevRevenue) / prevRevenue * 100)
        }
      }

      monthlyData.push({
        month: `${month.getMonth() + 1}月`,
        revenue: Number(monthData._sum.totalAmount || 0),
        orders: monthData._count.id,
        growth: Number(growth.toFixed(1))
      })
    }

    res.json({
      success: true,
      data: monthlyData
    })

  } catch (error) {
    console.error('Get monthly comparison error:', error)
    res.status(500).json({
      success: false,
      message: '獲取月度對比失敗'
    })
  }
})

// @desc    Get revenue chart data
// @route   GET /api/admin/finance/revenue-chart
// @access  Admin
router.get('/revenue-chart', async (req, res) => {
  try {
    const { type = 'monthly' } = req.query
    
    let chartData = []
    let labels = []

    if (type === 'monthly') {
      // 最近6個月數據
      const currentDate = new Date()
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1)
        
        const [revenueData, orderData] = await Promise.all([
          prisma.order.aggregate({
            where: {
              paymentStatus: 'COMPLETED',
              createdAt: {
                gte: month,
                lt: nextMonth
              }
            },
            _sum: { totalAmount: true }
          }),
          prisma.order.count({
            where: {
              paymentStatus: 'COMPLETED',
              createdAt: {
                gte: month,
                lt: nextMonth
              }
            }
          })
        ])

        chartData.push({
          revenue: Number(revenueData._sum.totalAmount || 0),
          orders: orderData
        })
        labels.push(`${month.getMonth() + 1}月`)
      }
    }

    res.json({
      success: true,
      data: {
        labels,
        revenue: chartData.map(d => d.revenue),
        orders: chartData.map(d => d.orders)
      }
    })

  } catch (error) {
    console.error('Get revenue chart error:', error)
    res.status(500).json({
      success: false,
      message: '獲取收入圖表失敗'
    })
  }
})

// @desc    Get category sales distribution
// @route   GET /api/admin/finance/category-distribution
// @access  Admin  
router.get('/category-distribution', async (req, res) => {
  try {
    const categoryStats = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        name: true,
        products: {
          select: {
            orderItems: {
              where: {
                order: {
                  paymentStatus: 'COMPLETED'
                }
              },
              select: {
                total: true
              }
            }
          }
        }
      }
    })

    const pieData = categoryStats.map(category => {
      const revenue = category.products.reduce((sum, product) => {
        return sum + product.orderItems.reduce((itemSum, item) => itemSum + Number(item.total), 0)
      }, 0)

      return {
        name: category.name,
        value: Math.round(revenue)
      }
    }).filter(item => item.value > 0)

    res.json({
      success: true,
      data: pieData
    })

  } catch (error) {
    console.error('Get category distribution error:', error)
    res.status(500).json({
      success: false,
      message: '獲取分類分佈失敗'
    })
  }
})

export default router