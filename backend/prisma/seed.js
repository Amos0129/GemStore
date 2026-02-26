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
        code: 'NECKLACE',
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
        code: 'BRACELET',
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
        code: 'RING',
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
        code: 'EARRING',
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
        code: 'PENDANT',
        description: '精緻的水晶吊墜飾品',
        icon: 'fas fa-diamond',
        sortOrder: 5
      }
    })
  ])

  console.log('📂 Created categories:', categories.length)

  // Create some customer users
  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'wang@example.com' },
      update: {},
      create: {
        email: 'wang@example.com',
        firstName: '小明',
        lastName: '王',
        password: await bcrypt.hash('customer123', 12),
        role: 'CUSTOMER',
        phone: '0912345678'
      }
    }),
    prisma.user.upsert({
      where: { email: 'li.meiling@example.com' },
      update: {},
      create: {
        email: 'li.meiling@example.com',
        firstName: '美玲',
        lastName: '李',
        password: await bcrypt.hash('customer123', 12),
        role: 'CUSTOMER',
        phone: '0923456789'
      }
    }),
    prisma.user.upsert({
      where: { email: 'chen.jianhua@example.com' },
      update: {},
      create: {
        email: 'chen.jianhua@example.com',
        firstName: '建華',
        lastName: '陳',
        password: await bcrypt.hash('customer123', 12),
        role: 'CUSTOMER',
        phone: '0934567890'
      }
    }),
    prisma.user.upsert({
      where: { email: 'zhang.yating@example.com' },
      update: {},
      create: {
        email: 'zhang.yating@example.com',
        firstName: '雅婷',
        lastName: '張',
        password: await bcrypt.hash('customer123', 12),
        role: 'CUSTOMER',
        phone: '0945678901'
      }
    }),
    prisma.user.upsert({
      where: { email: 'lin.zhiwei@example.com' },
      update: {},
      create: {
        email: 'lin.zhiwei@example.com',
        firstName: '志偉',
        lastName: '林',
        password: await bcrypt.hash('customer123', 12),
        role: 'CUSTOMER',
        phone: '0956789012'
      }
    })
  ])

  console.log('👥 Created customers:', customers.length)

  // Create addresses for customers
  const addresses = []
  for (let i = 0; i < customers.length; i++) {
    const address = await prisma.address.create({
      data: {
        userId: customers[i].id,
        type: 'SHIPPING',
        name: `${customers[i].lastName}${customers[i].firstName}`,
        phone: customers[i].phone,
        city: ['台北市', '台中市', '高雄市', '台南市', '新竹市'][i],
        district: ['信義區', '西區', '左營區', '東區', '東區'][i],
        address: `中正路${(i + 1) * 100}號${i + 1}樓`,
        postalCode: `${110 + i * 100}${String(i).padStart(2, '0')}`,
        isDefault: true
      }
    })
    addresses.push(address)
  }

  console.log('🏠 Created addresses:', addresses.length)

  // Create some sample products if they don't exist
  const sampleProducts = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'classic-diamond-necklace' },
      update: {},
      create: {
        name: '經典鑽石項鍊',
        slug: 'classic-diamond-necklace',
        sku: 'NECK001',
        description: '精緻的經典鑽石項鍊，適合各種場合佩戴',
        price: 15800,
        stock: 25,
        categoryId: categories[0].id,
        images: {
          create: {
            url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
            alt: '經典鑽石項鍊',
            isMain: true
          }
        }
      }
    }),
    prisma.product.upsert({
      where: { slug: 'rose-gold-bracelet' },
      update: {},
      create: {
        name: '玫瑰金手鍊',
        slug: 'rose-gold-bracelet',
        sku: 'BRAC001',
        description: '優雅的玫瑰金手鍊，展現女性魅力',
        price: 8900,
        stock: 30,
        categoryId: categories[1].id,
        images: {
          create: {
            url: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=400',
            alt: '玫瑰金手鍊',
            isMain: true
          }
        }
      }
    }),
    prisma.product.upsert({
      where: { slug: 'platinum-ring' },
      update: {},
      create: {
        name: '白金戒指',
        slug: 'platinum-ring',
        sku: 'RING001',
        description: '純白金打造的精美戒指',
        price: 12800,
        stock: 15,
        categoryId: categories[2].id,
        images: {
          create: {
            url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
            alt: '白金戒指',
            isMain: true
          }
        }
      }
    }),
    prisma.product.upsert({
      where: { slug: 'pearl-earrings' },
      update: {},
      create: {
        name: '珍珠耳環',
        slug: 'pearl-earrings',
        sku: 'EAR001',
        description: '典雅的珍珠耳環，提升氣質',
        price: 12500,
        stock: 20,
        categoryId: categories[3].id,
        images: {
          create: {
            url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
            alt: '珍珠耳環',
            isMain: true
          }
        }
      }
    }),
    prisma.product.upsert({
      where: { slug: 'silver-bracelet' },
      update: {},
      create: {
        name: '銀質手鍊',
        slug: 'silver-bracelet',
        sku: 'BRAC002',
        description: '簡約時尚的銀質手鍊',
        price: 7300,
        stock: 40,
        categoryId: categories[1].id,
        images: {
          create: {
            url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
            alt: '銀質手鍊',
            isMain: true
          }
        }
      }
    })
  ])

  console.log('💎 Created products:', sampleProducts.length)

  // Create sample orders
  const orders = await Promise.all([
    // 王小明的訂單 - 已付款
    prisma.order.create({
      data: {
        orderNumber: 'ORD-20240226-001',
        userId: customers[0].id,
        shippingAddressId: addresses[0].id,
        status: 'PAID',
        paymentStatus: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        subtotal: 15800,
        shippingFee: 100,
        totalAmount: 15900,
        paidAt: new Date('2024-02-26T10:35:00'),
        items: {
          create: {
            productId: sampleProducts[0].id,
            quantity: 1,
            price: 15800,
            total: 15800
          }
        },
        statusHistory: {
          create: [
            {
              status: 'PENDING',
              note: '訂單已建立'
            },
            {
              status: 'PAID',
              note: '付款完成'
            }
          ]
        }
      }
    }),

    // 李美玲的訂單 - 處理中
    prisma.order.create({
      data: {
        orderNumber: 'ORD-20240226-002',
        userId: customers[1].id,
        shippingAddressId: addresses[1].id,
        status: 'PROCESSING',
        paymentStatus: 'COMPLETED',
        paymentMethod: 'LINE_PAY',
        subtotal: 8900,
        shippingFee: 100,
        totalAmount: 9000,
        paidAt: new Date('2024-02-26T14:25:00'),
        items: {
          create: {
            productId: sampleProducts[1].id,
            quantity: 1,
            price: 8900,
            total: 8900
          }
        },
        statusHistory: {
          create: [
            {
              status: 'PENDING',
              note: '訂單已建立'
            },
            {
              status: 'PAID',
              note: 'Line Pay付款完成'
            },
            {
              status: 'PROCESSING',
              note: '開始處理訂單'
            }
          ]
        }
      }
    }),

    // 陳建華的訂單 - 已出貨
    prisma.order.create({
      data: {
        orderNumber: 'ORD-20240225-003',
        userId: customers[2].id,
        shippingAddressId: addresses[2].id,
        status: 'SHIPPED',
        paymentStatus: 'COMPLETED',
        paymentMethod: 'BANK_TRANSFER',
        subtotal: 25600,
        shippingFee: 0, // 滿額免運
        totalAmount: 25600,
        paidAt: new Date('2024-02-25T16:50:00'),
        shippedAt: new Date('2024-02-26T09:00:00'),
        trackingNumber: 'TW123456789',
        items: {
          create: {
            productId: sampleProducts[2].id,
            quantity: 2,
            price: 12800,
            total: 25600
          }
        },
        statusHistory: {
          create: [
            {
              status: 'PENDING',
              note: '訂單已建立'
            },
            {
              status: 'PAID',
              note: '銀行轉帳完成'
            },
            {
              status: 'PROCESSING',
              note: '開始處理訂單'
            },
            {
              status: 'SHIPPED',
              note: '商品已出貨，物流單號：TW123456789'
            }
          ]
        }
      }
    }),

    // 張雅婷的訂單 - 已完成
    prisma.order.create({
      data: {
        orderNumber: 'ORD-20240224-004',
        userId: customers[3].id,
        shippingAddressId: addresses[3].id,
        status: 'DELIVERED',
        paymentStatus: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        subtotal: 12500,
        shippingFee: 100,
        totalAmount: 12600,
        paidAt: new Date('2024-02-24T09:20:00'),
        shippedAt: new Date('2024-02-24T15:00:00'),
        deliveredAt: new Date('2024-02-25T14:30:00'),
        trackingNumber: 'TW234567890',
        items: {
          create: {
            productId: sampleProducts[3].id,
            quantity: 1,
            price: 12500,
            total: 12500
          }
        },
        statusHistory: {
          create: [
            {
              status: 'PENDING',
              note: '訂單已建立'
            },
            {
              status: 'PAID',
              note: '信用卡付款完成'
            },
            {
              status: 'PROCESSING',
              note: '開始處理訂單'
            },
            {
              status: 'SHIPPED',
              note: '商品已出貨'
            },
            {
              status: 'DELIVERED',
              note: '商品已送達'
            }
          ]
        }
      }
    }),

    // 林志偉的訂單 - 待付款
    prisma.order.create({
      data: {
        orderNumber: 'ORD-20240225-005',
        userId: customers[4].id,
        shippingAddressId: addresses[4].id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'BANK_TRANSFER',
        subtotal: 7300,
        shippingFee: 100,
        totalAmount: 7400,
        items: {
          create: {
            productId: sampleProducts[4].id,
            quantity: 1,
            price: 7300,
            total: 7300
          }
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            note: '訂單已建立，等待付款'
          }
        }
      }
    })
  ])

  console.log('📋 Created orders:', orders.length)

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