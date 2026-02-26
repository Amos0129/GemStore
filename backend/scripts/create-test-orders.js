import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestOrders() {
  console.log('正在創建測試訂單和用戶...')

  try {
    // 1. 創建測試用戶
    const customers = [
      {
        email: 'customer1@test.com',
        firstName: '王',
        lastName: '小明',
        password: 'password123',
        role: 'CUSTOMER',
        membershipLevel: 'GOLD'
      },
      {
        email: 'customer2@test.com',
        firstName: '李',
        lastName: '小華',
        password: 'password123',
        role: 'CUSTOMER',
        membershipLevel: 'SILVER'
      },
      {
        email: 'customer3@test.com',
        firstName: '張',
        lastName: '大偉',
        password: 'password123',
        role: 'CUSTOMER',
        membershipLevel: 'BRONZE'
      }
    ]

    const createdCustomers = []
    for (const customer of customers) {
      const user = await prisma.user.upsert({
        where: { email: customer.email },
        update: {},
        create: customer
      })
      createdCustomers.push(user)
      console.log(`✅ 用戶創建: ${user.firstName} ${user.lastName}`)
    }

    // 2. 為每個用戶創建地址
    for (const user of createdCustomers) {
      await prisma.address.create({
        data: {
          userId: user.id,
          type: 'SHIPPING',
          name: `${user.firstName} ${user.lastName}`,
          phone: '0912-345-678',
          country: 'Taiwan',
          city: '台北市',
          district: '信義區',
          address: '信義路五段7號',
          postalCode: '110',
          isDefault: true
        }
      })
    }
    console.log('✅ 地址創建完成')

    // 3. 獲取商品資料
    const products = await prisma.product.findMany({
      take: 8
    })

    if (products.length === 0) {
      throw new Error('沒有商品資料，請先執行商品種子數據腳本')
    }

    // 4. 創建測試訂單
    const orders = []
    const orderStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    const paymentStatuses = ['PENDING', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED']

    for (let i = 0; i < 10; i++) {
      const customer = createdCustomers[i % createdCustomers.length]
      const address = await prisma.address.findFirst({
        where: { userId: customer.id }
      })

      // 隨機選擇商品
      const orderProducts = products.slice(0, Math.floor(Math.random() * 3) + 1)
      
      let subtotal = 0
      const orderItems = orderProducts.map(product => {
        const quantity = Math.floor(Math.random() * 2) + 1
        const price = parseFloat(product.price)
        const total = price * quantity
        subtotal += total
        
        return {
          productId: product.id,
          quantity,
          price,
          total
        }
      })

      const shippingFee = subtotal >= 1500 ? 0 : 150
      const tax = Math.round(subtotal * 0.05)
      const totalAmount = subtotal + shippingFee + tax

      const orderDate = new Date()
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 7)) // 最近7天

      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-${String(i + 1).padStart(3, '0')}`,
          userId: customer.id,
          shippingAddressId: address.id,
          status: orderStatuses[i % orderStatuses.length],
          paymentStatus: paymentStatuses[i % paymentStatuses.length],
          paymentMethod: 'CREDIT_CARD',
          subtotal,
          shippingFee,
          tax,
          totalAmount,
          currency: 'TWD',
          createdAt: orderDate,
          items: {
            create: orderItems
          }
        },
        include: {
          items: true
        }
      })

      // 更新用戶總消費和訂單數
      if (order.paymentStatus === 'COMPLETED') {
        await prisma.user.update({
          where: { id: customer.id },
          data: {
            totalSpent: { increment: totalAmount },
            totalOrders: { increment: 1 }
          }
        })

        // 更新商品銷售數量
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              salesCount: { increment: item.quantity },
              stock: { decrement: item.quantity }
            }
          })
        }
      }

      orders.push(order)
      console.log(`✅ 訂單創建: ${order.orderNumber} - $${order.totalAmount}`)
    }

    // 5. 創建每日統計數據
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.toDateString() === date.toDateString()
      })

      const revenue = dayOrders
        .filter(order => order.paymentStatus === 'COMPLETED')
        .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0)

      await prisma.dailyStat.upsert({
        where: { date },
        update: {
          revenue,
          orders: dayOrders.length,
          customers: new Set(dayOrders.map(o => o.userId)).size
        },
        create: {
          date,
          revenue,
          orders: dayOrders.length,
          customers: new Set(dayOrders.map(o => o.userId)).size,
          newCustomers: i === 6 ? createdCustomers.length : 0,
          productViews: Math.floor(Math.random() * 100) + 50
        }
      })
    }
    console.log('✅ 每日統計創建完成')

    console.log('🎉 測試訂單和數據創建完成!')
    console.log(`📊 創建了 ${orders.length} 個訂單`)
    console.log(`👥 創建了 ${createdCustomers.length} 個測試用戶`)
    
  } catch (error) {
    console.error('❌ 創建測試數據失敗:', error)
    throw error
  }
}

createTestOrders()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })