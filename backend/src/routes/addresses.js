import express from 'express'
import prisma from '../utils/prisma.js'
import authMiddleware from '../middleware/auth.js'
import Joi from 'joi'

const router = express.Router()

// Validation schema
const addressSchema = Joi.object({
  name: Joi.string().required().min(1).max(50),
  phone: Joi.string().required().pattern(/^[0-9+\-\s()]+$/),
  city: Joi.string().required().min(1).max(50),
  district: Joi.string().required().min(1).max(50),
  address: Joi.string().required().min(1).max(200),
  zipCode: Joi.string().required().pattern(/^[0-9]{3,5}$/),
  isDefault: Joi.boolean().default(false)
})

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    res.json({
      success: true,
      data: addresses
    })
  } catch (error) {
    console.error('Get addresses error:', error)
    res.status(500).json({
      success: false,
      message: '獲取地址失敗',
      error: error.message
    })
  }
})

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { error, value } = addressSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    // If setting as default, remove default from other addresses
    if (value.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: req.user.id,
          isDefault: true
        },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        ...value,
        userId: req.user.id
      }
    })

    res.status(201).json({
      success: true,
      data: address,
      message: '地址新增成功'
    })
  } catch (error) {
    console.error('Create address error:', error)
    res.status(500).json({
      success: false,
      message: '新增地址失敗',
      error: error.message
    })
  }
})

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { error, value } = addressSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id: id,
        userId: req.user.id
      }
    })

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: '地址不存在'
      })
    }

    // If setting as default, remove default from other addresses
    if (value.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: req.user.id,
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.update({
      where: { id },
      data: value
    })

    res.json({
      success: true,
      data: address,
      message: '地址更新成功'
    })
  } catch (error) {
    console.error('Update address error:', error)
    res.status(500).json({
      success: false,
      message: '更新地址失敗',
      error: error.message
    })
  }
})

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id: id,
        userId: req.user.id
      }
    })

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: '地址不存在'
      })
    }

    await prisma.address.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: '地址刪除成功'
    })
  } catch (error) {
    console.error('Delete address error:', error)
    res.status(500).json({
      success: false,
      message: '刪除地址失敗',
      error: error.message
    })
  }
})

// @desc    Set address as default
// @route   PATCH /api/addresses/:id/default
// @access  Private
router.patch('/:id/default', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id: id,
        userId: req.user.id
      }
    })

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: '地址不存在'
      })
    }

    // Remove default from other addresses
    await prisma.address.updateMany({
      where: { 
        userId: req.user.id,
        isDefault: true
      },
      data: { isDefault: false }
    })

    // Set this address as default
    const address = await prisma.address.update({
      where: { id },
      data: { isDefault: true }
    })

    res.json({
      success: true,
      data: address,
      message: '預設地址設定成功'
    })
  } catch (error) {
    console.error('Set default address error:', error)
    res.status(500).json({
      success: false,
      message: '設定預設地址失敗',
      error: error.message
    })
  }
})

export default router