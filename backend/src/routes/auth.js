import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import { prisma } from '../lib/prisma.js'
import { authMiddleware } from '../middleware/auth.js'
import { generateToken, generateRefreshToken } from '../utils/jwt.js'
import { sendResetPasswordEmail } from '../utils/email.js'
import crypto from 'crypto'

const router = express.Router()

// Validation schemas
const registerSchema = Joi.object({
  firstName: Joi.string().required().min(1).max(50),
  lastName: Joi.string().required().min(1).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')),
  phone: Joi.string().allow('').pattern(/^[0-9+\-\s()]+$/),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
})

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required().min(6).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
})

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    const { firstName, lastName, email, password, phone } = value

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '此電子信箱已被註冊'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    // Generate tokens
    const accessToken = generateToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // Store refresh token in database (if implementing refresh token storage)
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        // You might want to add a refreshToken field to store hashed refresh tokens
      }
    })

    res.status(201).json({
      success: true,
      message: '註冊成功',
      data: {
        user,
        accessToken,
        refreshToken
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: '註冊失敗，請稍後再試'
    })
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    const { email, password } = value

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '電子信箱或密碼錯誤'
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '電子信箱或密碼錯誤'
      })
    }

    // Generate tokens
    const accessToken = generateToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      message: '登入成功',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: '登入失敗，請稍後再試'
    })
  }
})

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // In a more complete implementation, you might want to:
    // 1. Blacklist the current access token
    // 2. Remove refresh token from database
    // 3. Clear any server-side sessions

    res.json({
      success: true,
      message: '登出成功'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: '登出失敗'
    })
  }
})

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      })
    }

    // Generate new tokens
    const newAccessToken = generateToken(user.id)
    const newRefreshToken = generateRefreshToken(user.id)

    res.json({
      success: true,
      data: {
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    })

  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    })
  }
})

// @desc    Get current user info
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get user info error:', error)
    res.status(500).json({
      success: false,
      message: '獲取用戶資訊失敗'
    })
  }
})

// @desc    Forgot password
// @route   POST /api/auth/forgot
// @access  Public
router.post('/forgot', async (req, res) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    const { email } = value

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user || !user.isActive) {
      // For security, always return success even if user doesn't exist
      return res.json({
        success: true,
        message: '如果該電子信箱已註冊，您將收到重設密碼的指示'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Hash reset token and save to database
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedResetToken,
        passwordResetExpiry: resetTokenExpiry
      }
    })

    // Send email (implement this utility function)
    try {
      await sendResetPasswordEmail(user.email, resetToken)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Reset the token fields if email sending fails
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: null,
          passwordResetExpiry: null
        }
      })
      
      return res.status(500).json({
        success: false,
        message: '發送重設密碼郵件失敗'
      })
    }

    res.json({
      success: true,
      message: '重設密碼郵件已發送，請檢查您的信箱'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: '重設密碼失敗，請稍後再試'
    })
  }
})

// @desc    Reset password
// @route   POST /api/auth/reset
// @access  Public
router.post('/reset', async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      })
    }

    const { token, password } = value

    // Hash the token from URL
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpiry: {
          gt: new Date()
        },
        isActive: true
      }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: '重設密碼連結無效或已過期'
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null
      }
    })

    res.json({
      success: true,
      message: '密碼重設成功，請使用新密碼登入'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: '重設密碼失敗，請稍後再試'
    })
  }
})

export default router