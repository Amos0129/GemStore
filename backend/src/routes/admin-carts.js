import express from 'express'
import prisma from '../utils/prisma.js'
import authMiddleware, { adminOnly } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get all cart data (admin only)
// @route   GET /api/admin/carts
// @access  Admin
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, status = 'active' } = req.query
    const offset = (page - 1) * limit

    // Build where condition
    const whereCondition = {
      user: {
        isActive: true
      }
    }

    if (userId) {
      whereCondition.userId = userId
    }

    // Get cart items with user and product info
    const cartItems = await prisma.cartItem.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true
          }
        },
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { sortOrder: 'asc' }
            },
            category: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { addedAt: 'desc' },
      skip: offset,
      take: parseInt(limit)
    })

    // Get total count
    const totalCount = await prisma.cartItem.count({
      where: whereCondition
    })

    // Group by user
    const cartsByUser = {}
    cartItems.forEach(item => {
      const userId = item.userId
      
      if (!cartsByUser[userId]) {
        cartsByUser[userId] = {
          user: item.user,
          items: [],
          totalItems: 0,
          totalAmount: 0,
          lastUpdated: item.addedAt
        }
      }
      
      const subtotal = Number(item.product.price) * item.quantity
      cartsByUser[userId].items.push({
        id: item.id,
        quantity: item.quantity,
        subtotal,
        addedAt: item.addedAt,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          stock: item.product.stock,
          image: item.product.images[0]?.url || null,
          category: item.product.category.name
        }
      })
      
      cartsByUser[userId].totalItems += item.quantity
      cartsByUser[userId].totalAmount += subtotal
      
      // Update last updated time
      if (item.addedAt > cartsByUser[userId].lastUpdated) {
        cartsByUser[userId].lastUpdated = item.addedAt
      }
    })

    // Convert to array and sort by last updated
    const cartsArray = Object.values(cartsByUser).sort((a, b) => 
      new Date(b.lastUpdated) - new Date(a.lastUpdated)
    )

    res.json({
      success: true,
      data: {
        carts: cartsArray,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1,
          limit: parseInt(limit)
        }
      }
    })

  } catch (error) {
    console.error('Get carts error:', error)
    res.status(500).json({
      success: false,
      message: '獲取購物車數據失敗'
    })
  }
})

// @desc    Get cart statistics
// @route   GET /api/admin/carts/stats
// @access  Admin
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    // Get basic stats
    const [
      totalCarts,
      totalItems,
      totalUsers,
      recentCarts
    ] = await Promise.all([
      // Total unique carts
      prisma.cartItem.groupBy({
        by: ['userId'],
        _count: true
      }).then(results => results.length),
      
      // Total cart items
      prisma.cartItem.aggregate({
        _sum: { quantity: true },
        _count: true
      }),
      
      // Total users with items in cart
      prisma.cartItem.findMany({
        distinct: ['userId'],
        select: { userId: true }
      }).then(results => results.length),
      
      // Recent cart activity (last 24 hours)
      prisma.cartItem.count({
        where: {
          addedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    // Calculate total cart value
    const cartItemsWithProducts = await prisma.cartItem.findMany({
      include: {
        product: {
          select: { price: true }
        }
      }
    })

    const totalValue = cartItemsWithProducts.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity)
    }, 0)

    // Get top products in carts
    const topProducts = await prisma.cartItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: true,
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            price: true,
            images: {
              take: 1,
              orderBy: { sortOrder: 'asc' }
            }
          }
        })
        
        return {
          productId: item.productId,
          name: product?.name || 'Unknown Product',
          price: product?.price || 0,
          image: product?.images[0]?.url || null,
          totalQuantity: item._sum.quantity || 0,
          cartCount: item._count || 0
        }
      })
    )

    res.json({
      success: true,
      data: {
        totalCarts,
        totalItems: totalItems._sum.quantity || 0,
        totalItemRecords: totalItems._count || 0,
        totalUsers,
        totalValue: Math.round(totalValue),
        recentActivity: recentCarts,
        topProductsInCarts: topProductsWithDetails
      }
    })

  } catch (error) {
    console.error('Get cart stats error:', error)
    res.status(500).json({
      success: false,
      message: '獲取購物車統計失敗'
    })
  }
})

// @desc    Clear user cart (admin action)
// @route   DELETE /api/admin/carts/:userId
// @access  Admin
router.delete('/:userId', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用戶不存在'
      })
    }

    // Delete all cart items for this user
    const result = await prisma.cartItem.deleteMany({
      where: { userId }
    })

    res.json({
      success: true,
      message: `已清空用戶 ${user.email} 的購物車，移除了 ${result.count} 件商品`
    })

  } catch (error) {
    console.error('Clear user cart error:', error)
    res.status(500).json({
      success: false,
      message: '清空購物車失敗'
    })
  }
})

export default router