import { PrismaClient } from '@prisma/client'

console.log('Testing Prisma connection...')

try {
  const prisma = new PrismaClient()
  console.log('Prisma client created successfully')
  
  // Test connection
  await prisma.$connect()
  console.log('✅ Database connected successfully!')
  
  await prisma.$disconnect()
  console.log('✅ Disconnected successfully')
} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}