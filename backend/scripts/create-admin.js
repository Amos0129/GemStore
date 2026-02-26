import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  console.log('正在創建管理員帳戶...')

  try {
    // 使用 bcrypt 加密密碼
    const adminPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@crystaljewelry.com' },
      update: {},
      create: {
        email: 'admin@crystaljewelry.com',
        firstName: '管理員',
        lastName: '系統',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: true,
        membershipLevel: 'PLATINUM',
        isActive: true
      }
    })

    console.log('✅ 管理員帳戶創建成功!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Password: admin123')
    console.log('👤 Role:', admin.role)
    console.log('🆔 ID:', admin.id)
    
  } catch (error) {
    console.error('❌ 創建管理員失敗:', error)
    throw error
  }
}

createAdmin()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })