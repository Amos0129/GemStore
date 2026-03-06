import express from 'express'
import prisma from '../utils/prisma.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const wishlists = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              select: { url: true, alt: true }
            },
            category: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { addedAt: 'desc' }
    })

    const products = wishlists.map(wishlist => ({
      ...wishlist.product,
      image: wishlist.product.images[0]?.url || null,
      addedAt: wishlist.addedAt
    }))

    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Get wishlist error:', error)
    res.status(500).json({
      success: false,
      message: '獲取收藏清單失敗',
      error: error.message
    })
  }
})

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: '商品 ID 是必需的'
      })
    }

    // 檢查商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    // 檢查是否已在收藏清單中
    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: productId
        }
      }
    })

    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: '商品已在收藏清單中'
      })
    }

    // 添加到收藏清單
    await prisma.wishlist.create({
      data: {
        userId: req.user.id,
        productId: productId
      }
    })

    res.status(201).json({
      success: true,
      message: '已加入收藏清單'
    })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: '商品已在收藏清單中'
      })
    }
    
    res.status(500).json({
      success: false,
      message: '加入收藏失敗',
      error: error.message
    })
  }
})

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params

    const deletedWishlist = await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: productId
        }
      }
    })

    if (!deletedWishlist) {
      return res.status(404).json({
        success: false,
        message: '商品不在收藏清單中'
      })
    }

    res.json({
      success: true,
      message: '已從收藏清單移除'
    })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    res.status(500).json({
      success: false,
      message: '移除收藏失敗',
      error: error.message
    })
  }
})

// @desc    Clear all wishlist items
// @route   DELETE /api/wishlist
// @access  Private
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: req.user.id }
    })

    res.json({
      success: true,
      message: '收藏清單已清空'
    })
  } catch (error) {
    console.error('Clear wishlist error:', error)
    res.status(500).json({
      success: false,
      message: '清空收藏清單失敗',
      error: error.message
    })
  }
})

export default router