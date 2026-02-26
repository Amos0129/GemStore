import express from 'express'
import prisma from '../utils/prisma.js'
import authMiddleware, { adminOnly } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get all categories with hierarchy
// @route   GET /api/admin/categories
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        },
        children: {
          include: {
            _count: {
              select: { products: true }
            }
          }
        }
      },
      where: { parentId: null },
      orderBy: { sortOrder: 'asc' }
    })

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      code: category.slug,
      description: category.description,
      icon: 'Star', // 預設圖示，可根據需要擴展
      sort: category.sortOrder || 0,
      status: category.isActive ? 1 : 0,
      productCount: category._count.products,
      children: category.children?.map(child => ({
        id: child.id,
        name: child.name,
        code: child.slug,
        description: child.description,
        icon: 'Star',
        sort: child.sortOrder || 0,
        status: child.isActive ? 1 : 0,
        productCount: child._count.products,
        parentId: category.id
      })) || []
    }))

    res.json({
      success: true,
      data: formattedCategories
    })

  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: '獲取分類列表失敗'
    })
  }
})

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Admin
router.post('/', async (req, res) => {
  try {
    const { name, code, parentId, description, sort = 0 } = req.body

    // 檢查代碼是否已存在
    const existingCategory = await prisma.category.findUnique({
      where: { slug: code }
    })

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: '分類代碼已存在'
      })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: code,
        description,
        parentId,
        sortOrder: parseInt(sort),
        isActive: true
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: '分類創建成功',
      data: {
        id: category.id,
        name: category.name,
        code: category.slug,
        description: category.description,
        icon: 'Star',
        sort: category.sortOrder,
        status: category.isActive ? 1 : 0,
        productCount: category._count.products,
        parentId: category.parentId
      }
    })

  } catch (error) {
    console.error('Create category error:', error)
    res.status(500).json({
      success: false,
      message: '創建分類失敗'
    })
  }
})

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Admin
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, code, description, sort, status } = req.body

    // 檢查代碼是否與其他分類衝突
    if (code) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug: code,
          id: { not: id }
        }
      })

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: '分類代碼已存在'
        })
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: code,
        description,
        sortOrder: sort ? parseInt(sort) : undefined,
        isActive: status === 1
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    res.json({
      success: true,
      message: '分類更新成功',
      data: {
        id: category.id,
        name: category.name,
        code: category.slug,
        description: category.description,
        icon: 'Star',
        sort: category.sortOrder,
        status: category.isActive ? 1 : 0,
        productCount: category._count.products,
        parentId: category.parentId
      }
    })

  } catch (error) {
    console.error('Update category error:', error)
    res.status(500).json({
      success: false,
      message: '更新分類失敗'
    })
  }
})

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // 檢查是否有商品使用此分類
    const productCount = await prisma.product.count({
      where: { categoryId: id }
    })

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: '該分類下還有商品，無法刪除'
      })
    }

    // 檢查是否有子分類
    const childCount = await prisma.category.count({
      where: { parentId: id }
    })

    if (childCount > 0) {
      return res.status(400).json({
        success: false,
        message: '該分類下還有子分類，無法刪除'
      })
    }

    await prisma.category.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: '分類刪除成功'
    })

  } catch (error) {
    console.error('Delete category error:', error)
    res.status(500).json({
      success: false,
      message: '刪除分類失敗'
    })
  }
})

// @desc    Toggle category status
// @route   PUT /api/admin/categories/:id/status
// @access  Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const category = await prisma.category.update({
      where: { id },
      data: { isActive: status === 1 }
    })

    res.json({
      success: true,
      message: `分類已${status === 1 ? '啟用' : '停用'}`,
      data: category
    })

  } catch (error) {
    console.error('Toggle category status error:', error)
    res.status(500).json({
      success: false,
      message: '更新分類狀態失敗'
    })
  }
})

export default router