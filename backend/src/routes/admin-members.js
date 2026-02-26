import express from 'express'
import prisma from '../utils/prisma.js'
import authMiddleware, { adminOnly } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get members statistics
// @route   GET /api/admin/members/stats
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const [
      totalMembers,
      activeMembers,
      newMembersThisMonth,
      avgSpending
    ] = await Promise.all([
      // 總會員數
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),
      // 活躍會員數 (isActive = true)
      prisma.user.count({
        where: { 
          role: 'CUSTOMER',
          isActive: true 
        }
      }),
      // 本月新會員
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: startOfMonth }
        }
      }),
      // 平均消費
      prisma.user.aggregate({
        where: { 
          role: 'CUSTOMER',
          totalSpent: { gt: 0 }
        },
        _avg: { totalSpent: true }
      })
    ])

    res.json({
      success: true,
      data: {
        total: totalMembers,
        active: activeMembers,
        newThisMonth: newMembersThisMonth,
        avgSpending: Math.round(avgSpending._avg.totalSpent || 0)
      }
    })

  } catch (error) {
    console.error('Get member stats error:', error)
    res.status(500).json({
      success: false,
      message: '獲取會員統計失敗'
    })
  }
})

// @desc    Get members list
// @route   GET /api/admin/members
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      status = '', 
      level = '',
      startDate = '',
      endDate = ''
    } = req.query

    const offset = (parseInt(page) - 1) * parseInt(limit)
    
    // 構建查詢條件
    const where = {
      role: 'CUSTOMER'
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where.isActive = status === 'active'
    }

    if (level) {
      where.membershipLevel = level.toUpperCase()
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          membershipLevel: true,
          totalSpent: true,
          totalOrders: true,
          isActive: true,
          createdAt: true
        },
        skip: offset,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    const formattedMembers = members.map(member => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      email: member.email,
      phone: member.phone || '-',
      avatar: member.avatar,
      level: member.membershipLevel?.toLowerCase() || 'bronze',
      totalSpent: Number(member.totalSpent || 0),
      orderCount: member.totalOrders || 0,
      status: member.isActive ? 'active' : 'inactive',
      createdAt: member.createdAt.toISOString()
    }))

    res.json({
      success: true,
      data: {
        members: formattedMembers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    })

  } catch (error) {
    console.error('Get members error:', error)
    res.status(500).json({
      success: false,
      message: '獲取會員列表失敗'
    })
  }
})

// @desc    Update member status
// @route   PUT /api/admin/members/:id/status
// @access  Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const member = await prisma.user.update({
      where: { id },
      data: { isActive: status === 'active' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    })

    res.json({
      success: true,
      message: `會員已${status === 'active' ? '啟用' : '停用'}`,
      data: member
    })

  } catch (error) {
    console.error('Update member status error:', error)
    res.status(500).json({
      success: false,
      message: '更新會員狀態失敗'
    })
  }
})

export default router