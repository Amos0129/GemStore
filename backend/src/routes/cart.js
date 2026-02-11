import express from 'express'
import Joi from 'joi'
import prisma from '../utils/prisma.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Joi schemas
const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
})

const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required()
})

// GET /api/cart - 獲取購物車內容
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: req.user.id
      },
      include: {
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
      orderBy: { addedAt: 'desc' }
    })

    // Calculate totals
    let totalItems = 0
    let totalAmount = 0

    const formattedItems = cartItems.map(item => {
      const subtotal = item.product.price * item.quantity
      totalItems += item.quantity
      totalAmount += subtotal

      return {
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
          isActive: item.product.isActive,
          badge: item.product.badge,
          image: item.product.images[0]?.url || null,
          category: item.product.category.name
        }
      }
    })

    res.json({
      success: true,
      data: {
        items: formattedItems,
        summary: {
          totalItems,
          totalAmount,
          itemCount: cartItems.length
        }
      }
    })
  } catch (error) {
    console.error('Get cart error:', error)
    res.status(500).json({
      success: false,
      message: '獲取購物車失敗'
    })
  }
})

// POST /api/cart/add - 加入商品到購物車
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { error, value } = addToCartSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        message: '請求資料格式錯誤',
        details: error.details[0].message
      })
    }

    const { productId, quantity } = value

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true
      }
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: '商品已下架'
      })
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `庫存不足，目前僅剩 ${product.stock} 件`
      })
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: productId
        }
      }
    })

    let cartItem

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `購物車已有 ${existingCartItem.quantity} 件，加上 ${quantity} 件會超過庫存限制`
        })
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true
            }
          }
        }
      })
    }

    res.json({
      success: true,
      message: '已加入購物車',
      data: {
        id: cartItem.id,
        quantity: cartItem.quantity,
        subtotal: cartItem.product.price * cartItem.quantity,
        product: cartItem.product
      }
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    res.status(500).json({
      success: false,
      message: '加入購物車失敗'
    })
  }
})

// PUT /api/cart/:itemId - 更新購物車商品數量
router.put('/:itemId', authMiddleware, async (req, res) => {
  try {
    const { error, value } = updateCartSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        message: '請求資料格式錯誤',
        details: error.details[0].message
      })
    }

    const { itemId } = req.params
    const { quantity } = value

    // Find cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: req.user.id
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            isActive: true
          }
        }
      }
    })

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: '購物車項目不存在'
      })
    }

    if (!cartItem.product.isActive) {
      return res.status(400).json({
        success: false,
        message: '商品已下架，無法更新數量'
      })
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `庫存不足，目前僅剩 ${cartItem.product.stock} 件`
      })
    }

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true
          }
        }
      }
    })

    res.json({
      success: true,
      message: '購物車已更新',
      data: {
        id: updatedCartItem.id,
        quantity: updatedCartItem.quantity,
        subtotal: updatedCartItem.product.price * updatedCartItem.quantity,
        product: updatedCartItem.product
      }
    })
  } catch (error) {
    console.error('Update cart error:', error)
    res.status(500).json({
      success: false,
      message: '更新購物車失敗'
    })
  }
})

// DELETE /api/cart/:itemId - 移除購物車商品
router.delete('/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: req.user.id
      }
    })

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: '購物車項目不存在'
      })
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    res.json({
      success: true,
      message: '已從購物車移除'
    })
  } catch (error) {
    console.error('Remove cart item error:', error)
    res.status(500).json({
      success: false,
      message: '移除商品失敗'
    })
  }
})

// DELETE /api/cart - 清空購物車
router.delete('/', authMiddleware, async (req, res) => {
  try {
    // Delete all cart items for user
    const result = await prisma.cartItem.deleteMany({
      where: {
        userId: req.user.id
      }
    })

    res.json({
      success: true,
      message: `已清空購物車，移除了 ${result.count} 件商品`
    })
  } catch (error) {
    console.error('Clear cart error:', error)
    res.status(500).json({
      success: false,
      message: '清空購物車失敗'
    })
  }
})

export default router