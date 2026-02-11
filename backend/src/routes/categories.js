import express from 'express'
import { prisma } from '../lib/prisma.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'
import Joi from 'joi'

const router = express.Router()

// Validation schemas
const categorySchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  slug: Joi.string().required().pattern(/^[a-z0-9-]+$/),
  description: Joi.string().allow('').max(500),
  icon: Joi.string().allow('').max(100),
  image: Joi.string().allow('').max(255),
  isActive: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0)
})

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { active = 'true' } = req.query

    const categories = await prisma.category.findMany({
      where: active === 'true' ? { isActive: true } : {},
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    // Transform data to include product count
    const categoriesWithCount = categories.map(category => ({
      ...category,
      productCount: category._count.products,
      _count: undefined
    }))

    res.json({
      success: true,
      data: categoriesWithCount,
      count: categories.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    })
  }
})

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            originalPrice: true,
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1
            },
            rating: true,
            reviewCount: true,
            badge: true
          },
          orderBy: [
            { isFeatured: 'desc' },
            { createdAt: 'desc' }
          ]
        },
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    res.json({
      success: true,
      data: {
        ...category,
        productCount: category._count.products,
        _count: undefined
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    })
  }
})

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { error, value } = categorySchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: value.slug }
    })

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category slug already exists'
      })
    }

    const category = await prisma.category.create({
      data: value
    })

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    })
  }
})

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params
    const { error, value } = categorySchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    // Check if new slug conflicts with other categories
    if (value.slug !== existingCategory.slug) {
      const slugConflict = await prisma.category.findUnique({
        where: { slug: value.slug }
      })

      if (slugConflict) {
        return res.status(400).json({
          success: false,
          message: 'Category slug already exists'
        })
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: value
    })

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    })
  }
})

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      })
    }

    await prisma.category.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    })
  }
})

export default router