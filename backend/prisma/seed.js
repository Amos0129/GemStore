import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crystal-jewelry.com' },
    update: {},
    create: {
      email: 'admin@crystal-jewelry.com',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('👤 Created admin user:', admin.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'necklace' },
      update: {},
      create: {
        name: '項鍊',
        slug: 'necklace',
        description: '各種款式的天然水晶項鍊',
        icon: 'fas fa-gem',
        sortOrder: 1
      }
    }),
    prisma.category.upsert({
      where: { slug: 'bracelet' },
      update: {},
      create: {
        name: '手鍊',
        slug: 'bracelet', 
        description: '精美的水晶手鍊系列',
        icon: 'fas fa-circle-dot',
        sortOrder: 2
      }
    }),
    prisma.category.upsert({
      where: { slug: 'ring' },
      update: {},
      create: {
        name: '戒指',
        slug: 'ring',
        description: '獨特設計的水晶戒指',
        icon: 'fas fa-ring',
        sortOrder: 3
      }
    }),
    prisma.category.upsert({
      where: { slug: 'earring' },
      update: {},
      create: {
        name: '耳飾',
        slug: 'earring',
        description: '優雅的水晶耳環與耳飾',
        icon: 'fas fa-star',
        sortOrder: 4
      }
    }),
    prisma.category.upsert({
      where: { slug: 'pendant' },
      update: {},
      create: {
        name: '吊墜',
        slug: 'pendant',
        description: '精緻的水晶吊墜飾品',
        icon: 'fas fa-diamond',
        sortOrder: 5
      }
    })
  ])

  console.log('📂 Created categories:', categories.length)

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })