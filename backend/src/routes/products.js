import express from 'express'
import Joi from 'joi'
import { prisma } from '../lib/prisma.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string().required().min(1).max(200),
  slug: Joi.string().required().pattern(/^[a-z0-9-]+$/),
  description: Joi.string().allow('').max(2000),
  shortDesc: Joi.string().allow('').max(300),
  price: Joi.number().positive().required(),
  originalPrice: Joi.number().positive().allow(null),
  stock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().allow('').max(50),
  weight: Joi.number().positive().allow(null),
  dimensions: Joi.string().allow('').max(100),
  categoryId: Joi.string().required(),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  badge: Joi.string().valid('new', 'hot', 'sale', 'limited').allow(null),
  images: Joi.array().items(Joi.object({
    url: Joi.string().uri().required(),
    alt: Joi.string().allow('').max(100),
    sortOrder: Joi.number().integer().min(0).default(0)
  })).default([]),
  tags: Joi.array().items(Joi.string()).default([])
})

const updateStockSchema = Joi.object({
  stock: Joi.number().integer().min(0).required(),
  operation: Joi.string().valid('set', 'add', 'subtract').default('set')
})

// @desc    Get all products with filtering, search, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      inStock,
      badge,
      tags
    } = req.query

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where = {
      isActive: true
    }

    // Category filter
    if (category) {
      where.categoryId = category
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Featured filter
    if (featured === 'true') {
      where.isFeatured = true
    }

    // Stock filter
    if (inStock === 'true') {
      where.stock = { gt: 0 }
    }

    // Badge filter
    if (badge) {
      where.badge = badge
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags]
      where.tags = {
        some: {
          tag: {
            name: { in: tagArray }
          }
        }
      }
    }

    // Build orderBy
    const orderBy = {}
    if (sortBy === 'price') {
      orderBy.price = sortOrder
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else if (sortBy === 'rating') {
      orderBy.rating = sortOrder
    } else if (sortBy === 'sales') {
      orderBy.salesCount = sortOrder
    } else if (sortBy === 'newest') {
      orderBy.createdAt = 'desc'
    } else if (sortBy === 'featured') {
      orderBy.isFeatured = 'desc'
    } else {
      orderBy.createdAt = sortOrder
    }

    // Get products and total count
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              url: true,
              alt: true,
              sortOrder: true
            }
          },
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  color: true
                }
              }
            }
          },
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    // Transform data
    const transformedProducts = products.map(product => ({
      ...product,
      reviewCount: product._count.reviews,
      tags: product.tags.map(pt => pt.tag),
      _count: undefined
    }))

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum)
    const hasNextPage = pageNum < totalPages
    const hasPrevPage = pageNum > 1

    res.json({
      success: true,
      data: transformedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      }
    })

  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      success: false,
      message: '獲取商品列表失敗'
    })
  }
})

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        stock: { gt: 0 }
      },
      take: parseInt(limit),
      orderBy: [
        { salesCount: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
          select: {
            id: true,
            url: true,
            alt: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Get featured products error:', error)
    res.status(500).json({
      success: false,
      message: '獲取精選商品失敗'
    })
  }
})

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: '搜尋關鍵字至少需要2個字元'
      })
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query.trim(), mode: 'insensitive' } },
          { description: { contains: query.trim(), mode: 'insensitive' } },
          { shortDesc: { contains: query.trim(), mode: 'insensitive' } }
        ]
      },
      take: parseInt(limit),
      orderBy: [
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          take: 1,
          orderBy: { sortOrder: 'asc' },
          select: {
            url: true,
            alt: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Search products error:', error)
    res.status(500).json({
      success: false,
      message: '商品搜尋失敗'
    })
  }
})

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { 
        id,
        isActive: true 
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            url: true,
            alt: true,
            sortOrder: true
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        },
        reviews: {
          where: { isVisible: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { reviews: true }
        }
      }
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    // Increment view count
    await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    // Transform data
    const transformedProduct = {
      ...product,
      reviewCount: product._count.reviews,
      tags: product.tags.map(pt => pt.tag),
      _count: undefined
    }

    res.json({
      success: true,
      data: transformedProduct
    })

  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({
      success: false,
      message: '獲取商品詳情失敗'
    })
  }
})

// @desc    Create product
// @route   POST /api/products
// @access  Admin
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    const { images, tags, ...productData } = value

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: productData.slug }
    })

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: '商品slug已存在'
      })
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId }
    })

    if (!category) {
      return res.status(400).json({
        success: false,
        message: '商品分類不存在'
      })
    }

    // Create product with transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create product
      const newProduct = await tx.product.create({
        data: productData
      })

      // Create images
      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map(img => ({
            productId: newProduct.id,
            url: img.url,
            alt: img.alt || '',
            sortOrder: img.sortOrder || 0
          }))
        })
      }

      // Handle tags
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // Find or create tag
          let tag = await tx.tag.findUnique({
            where: { name: tagName }
          })

          if (!tag) {
            tag = await tx.tag.create({
              data: { name: tagName }
            })
          }

          // Create product-tag relation
          await tx.productTag.create({
            data: {
              productId: newProduct.id,
              tagId: tag.id
            }
          })
        }
      }

      return newProduct
    })

    // Fetch complete product data
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      data: {
        ...completeProduct,
        tags: completeProduct.tags.map(pt => pt.tag)
      },
      message: '商品建立成功'
    })

  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({
      success: false,
      message: '建立商品失敗'
    })
  }
})

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params
    const { error, value } = productSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    const { images, tags, ...productData } = value

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    // Check slug conflict
    if (productData.slug !== existingProduct.slug) {
      const slugConflict = await prisma.product.findUnique({
        where: { slug: productData.slug }
      })

      if (slugConflict) {
        return res.status(400).json({
          success: false,
          message: '商品slug已存在'
        })
      }
    }

    // Update product with transaction
    const product = await prisma.$transaction(async (tx) => {
      // Update product
      const updatedProduct = await tx.product.update({
        where: { id },
        data: productData
      })

      // Update images
      if (images !== undefined) {
        // Delete existing images
        await tx.productImage.deleteMany({
          where: { productId: id }
        })

        // Create new images
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map(img => ({
              productId: id,
              url: img.url,
              alt: img.alt || '',
              sortOrder: img.sortOrder || 0
            }))
          })
        }
      }

      // Update tags
      if (tags !== undefined) {
        // Delete existing product-tag relations
        await tx.productTag.deleteMany({
          where: { productId: id }
        })

        // Create new relations
        if (tags.length > 0) {
          for (const tagName of tags) {
            // Find or create tag
            let tag = await tx.tag.findUnique({
              where: { name: tagName }
            })

            if (!tag) {
              tag = await tx.tag.create({
                data: { name: tagName }
              })
            }

            // Create product-tag relation
            await tx.productTag.create({
              data: {
                productId: id,
                tagId: tag.id
              }
            })
          }
        }
      }

      return updatedProduct
    })

    // Fetch complete product data
    const completeProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        }
      }
    })

    res.json({
      success: true,
      data: {
        ...completeProduct,
        tags: completeProduct.tags.map(pt => pt.tag)
      },
      message: '商品更新成功'
    })

  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({
      success: false,
      message: '更新商品失敗'
    })
  }
})

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Admin
router.put('/:id/stock', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params
    const { error, value } = updateStockSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    const { stock, operation } = value

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    let newStock = stock
    if (operation === 'add') {
      newStock = existingProduct.stock + stock
    } else if (operation === 'subtract') {
      newStock = Math.max(0, existingProduct.stock - stock)
    }

    const product = await prisma.product.update({
      where: { id },
      data: { stock: newStock }
    })

    res.json({
      success: true,
      data: product,
      message: '庫存更新成功'
    })

  } catch (error) {
    console.error('Update stock error:', error)
    res.status(500).json({
      success: false,
      message: '更新庫存失敗'
    })
  }
})

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { 
            orderItems: true,
            cartItems: true,
            reviews: true
          }
        }
      }
    })

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      })
    }

    // Check if product has orders or reviews
    if (existingProduct._count.orderItems > 0 || existingProduct._count.reviews > 0) {
      // Soft delete - just deactivate
      await prisma.product.update({
        where: { id },
        data: { isActive: false }
      })

      return res.json({
        success: true,
        message: '商品已停用（因為有相關訂單或評價記錄）'
      })
    }

    // Hard delete if no related data
    await prisma.$transaction(async (tx) => {
      // Delete product images
      await tx.productImage.deleteMany({
        where: { productId: id }
      })

      // Delete product-tag relations
      await tx.productTag.deleteMany({
        where: { productId: id }
      })

      // Delete cart items
      await tx.cartItem.deleteMany({
        where: { productId: id }
      })

      // Delete wishlist items
      await tx.wishlist.deleteMany({
        where: { productId: id }
      })

      // Delete product
      await tx.product.delete({
        where: { id }
      })
    })

    res.json({
      success: true,
      message: '商品刪除成功'
    })

  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({
      success: false,
      message: '刪除商品失敗'
    })
  }
})

export default router