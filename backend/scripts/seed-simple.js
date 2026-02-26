import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('開始種子資料插入...')

  try {
    // 1. 創建商品分類
    const categories = [
      {
        name: '項鍊',
        slug: 'necklace',
        code: 'NK001',
        description: '各種款式的項鍊飾品',
        icon: 'fas fa-gem',
        sortOrder: 1
      },
      {
        name: '手鍊',
        slug: 'bracelet',
        code: 'BR001', 
        description: '各種手鍊飾品',
        icon: 'fas fa-circle-dot',
        sortOrder: 2
      },
      {
        name: '戒指',
        slug: 'ring',
        code: 'RG001',
        description: '各種戒指飾品',
        icon: 'fas fa-ring',
        sortOrder: 3
      },
      {
        name: '耳飾',
        slug: 'earring',
        code: 'ER001',
        description: '各種耳環、耳釘飾品',
        icon: 'fas fa-star',
        sortOrder: 4
      },
      {
        name: '吊墜',
        slug: 'pendant',
        code: 'PD001',
        description: '各種吊墜飾品',
        icon: 'fas fa-diamond',
        sortOrder: 5
      }
    ]

    const createdCategories = {}
    for (const categoryData of categories) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: {},
        create: categoryData
      })
      createdCategories[category.slug] = category.id
      console.log(`✅ 分類創建: ${category.name}`)
    }

    // 2. 創建商品
    const products = [
      {
        name: '紫水晶能量項鍊',
        slug: 'amethyst-energy-necklace',
        sku: 'NK-AME-001',
        description: '高品質紫水晶製成，能夠帶來平靜與智慧的能量，適合冥想與提升直覺力。這款項鍊採用天然紫水晶製作，每顆寶石都經過精心挑選，色澤純淨，能量強大。',
        shortDesc: '天然紫水晶製成，帶來平靜與智慧的能量',
        price: 2800.00,
        originalPrice: 3200.00,
        cost: 1400.00,
        stock: 15,
        lowStockThreshold: 5,
        weight: 25.5,
        dimensions: '45cm x 8mm',
        categoryId: createdCategories.necklace,
        isActive: true,
        isFeatured: true,
        badge: 'sale',
        metaTitle: '紫水晶能量項鍊 - 提升直覺力與智慧',
        metaDescription: '天然紫水晶項鍊，帶來平靜智慧能量，適合冥想提升直覺力',
        metaKeywords: '紫水晶,項鍊,能量,冥想,直覺力'
      },
      {
        name: '粉晶愛情手鍊',
        slug: 'rose-quartz-love-bracelet',
        sku: 'BR-RQ-001',
        description: '溫柔的粉晶能夠招來愛情，提升人際關係，帶來內心的平和與溫暖。這款手鍊使用優質粉水晶製作，色澤柔和，觸感溫潤，是增進愛情運勢的絕佳選擇。',
        shortDesc: '粉水晶手鍊，招來愛情提升人際關係',
        price: 1680.00,
        cost: 840.00,
        stock: 22,
        lowStockThreshold: 8,
        weight: 18.2,
        dimensions: '18cm 可調節',
        categoryId: createdCategories.bracelet,
        isActive: true,
        isFeatured: true,
        badge: 'hot',
        metaTitle: '粉晶愛情手鍊 - 招來愛情好運',
        metaDescription: '天然粉水晶手鍊，招來愛情運勢，提升人際關係和諧',
        metaKeywords: '粉晶,手鍊,愛情,人際關係'
      },
      {
        name: '白水晶淨化戒指',
        slug: 'clear-quartz-purify-ring',
        sku: 'RG-CQ-001',
        description: '純淨的白水晶能夠淨化負能量，帶來清明的思緒與心靈的平靜。這款戒指採用頂級白水晶製作，透明度極高，具有強大的淨化和保護功能。',
        shortDesc: '白水晶戒指，淨化負能量帶來心靈平靜',
        price: 3200.00,
        cost: 1600.00,
        stock: 12,
        lowStockThreshold: 3,
        weight: 8.5,
        dimensions: '可調節戒圍',
        categoryId: createdCategories.ring,
        isActive: true,
        isFeatured: false,
        metaTitle: '白水晶淨化戒指 - 淨化負能量',
        metaDescription: '純淨白水晶戒指，淨化負能量，帶來清明思緒和心靈平靜',
        metaKeywords: '白水晶,戒指,淨化,負能量,平靜'
      },
      {
        name: '黃水晶財運耳環',
        slug: 'citrine-wealth-earring',
        sku: 'ER-CT-001',
        description: '黃水晶能夠招財進寶，提升自信心與創造力，是商務人士的最佳選擇。這對耳環採用天然黃水晶製作，色澤金黃，象徵財富與成功。',
        shortDesc: '黃水晶耳環，招財進寶提升創造力',
        price: 1800.00,
        originalPrice: 2200.00,
        cost: 900.00,
        stock: 18,
        lowStockThreshold: 6,
        weight: 6.8,
        dimensions: '2.5cm 垂墜式',
        categoryId: createdCategories.earring,
        isActive: true,
        isFeatured: true,
        badge: 'sale',
        metaTitle: '黃水晶財運耳環 - 招財進寶',
        metaDescription: '天然黃水晶耳環，招財進寶，提升自信心和創造力',
        metaKeywords: '黃水晶,耳環,招財,創造力,自信'
      },
      {
        name: '綠髮晶招財手鍊',
        slug: 'green-rutilated-wealth-bracelet',
        sku: 'BR-GR-001',
        description: '綠髮晶具有強大的招財能力，能夠提升事業運勢與財富機會。這款手鍊內含天然髮絲狀礦物，每一顆都獨一無二，是事業成功的幸運石。',
        shortDesc: '綠髮晶手鍊，強力招財提升事業運',
        price: 2500.00,
        cost: 1250.00,
        stock: 10,
        lowStockThreshold: 3,
        weight: 32.1,
        dimensions: '19cm 可調節',
        categoryId: createdCategories.bracelet,
        isActive: true,
        isFeatured: true,
        metaTitle: '綠髮晶招財手鍊 - 事業成功',
        metaDescription: '天然綠髮晶手鍊，強力招財，提升事業運勢和財富機會',
        metaKeywords: '綠髮晶,手鍊,招財,事業運,財富'
      },
      {
        name: '月光石直覺項鍊',
        slug: 'moonstone-intuition-necklace',
        sku: 'NK-MS-001',
        description: '月光石能夠增強直覺力與靈性感知，幫助女性平衡內分泌系統。這款項鍊呈現迷人的藍色暈彩，在光線下閃爍著神秘光芒。',
        shortDesc: '月光石項鍊，增強直覺力與靈性感知',
        price: 3600.00,
        cost: 1800.00,
        stock: 8,
        lowStockThreshold: 2,
        weight: 28.3,
        dimensions: '50cm x 12mm',
        categoryId: createdCategories.necklace,
        isActive: true,
        isFeatured: false,
        metaTitle: '月光石直覺項鍊 - 增強靈性感知',
        metaDescription: '天然月光石項鍊，增強直覺力和靈性感知，女性首選',
        metaKeywords: '月光石,項鍊,直覺力,靈性,女性'
      },
      {
        name: '黑曜石保護戒指',
        slug: 'obsidian-protection-ring',
        sku: 'RG-OB-001',
        description: '黑曜石具有強大的保護能力，能夠阻擋負面能量與邪氣入侵。這款戒指表面光滑如鏡，黑亮深邃，是最佳的護身飾品。',
        shortDesc: '黑曜石戒指，強力保護阻擋負能量',
        price: 2200.00,
        originalPrice: 2600.00,
        cost: 1100.00,
        stock: 16,
        lowStockThreshold: 5,
        weight: 12.7,
        dimensions: '可調節戒圍',
        categoryId: createdCategories.ring,
        isActive: true,
        isFeatured: false,
        badge: 'sale',
        metaTitle: '黑曜石保護戒指 - 阻擋負能量',
        metaDescription: '天然黑曜石戒指，強力保護，阻擋負面能量和邪氣',
        metaKeywords: '黑曜石,戒指,保護,負能量,護身'
      },
      {
        name: '海藍寶溝通耳環',
        slug: 'aquamarine-communication-earring',
        sku: 'ER-AQ-001',
        description: '海藍寶能夠提升溝通能力與表達技巧，增進人際關係的和諧。這對耳環呈現清澈的海藍色，如海水般純淨透明。',
        shortDesc: '海藍寶耳環，提升溝通能力和表達技巧',
        price: 2900.00,
        cost: 1450.00,
        stock: 14,
        lowStockThreshold: 4,
        weight: 5.2,
        dimensions: '1.8cm 釘式',
        categoryId: createdCategories.earring,
        isActive: true,
        isFeatured: false,
        metaTitle: '海藍寶溝通耳環 - 提升表達能力',
        metaDescription: '天然海藍寶耳環，提升溝通能力和表達技巧，增進人際和諧',
        metaKeywords: '海藍寶,耳環,溝通,表達,人際關係'
      }
    ]

    for (const productData of products) {
      const product = await prisma.product.create({
        data: productData
      })

      // 為每個商品添加圖片
      const imageUrls = [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'
      ]

      const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)]
      
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: randomImage,
          alt: product.name,
          sortOrder: 0,
          isMain: true
        }
      })

      console.log(`✅ 商品創建: ${product.name}`)
    }

    // 3. 創建系統設定
    const settings = [
      {
        key: 'site_name',
        value: 'Crystal Jewelry 水晶珠寶',
        type: 'STRING',
        category: 'general',
        description: '網站名稱',
        isPublic: true
      },
      {
        key: 'site_description',
        value: '專業的天然水晶珠寶電商平台，提供各種能量水晶飾品',
        type: 'TEXT',
        category: 'general', 
        description: '網站描述',
        isPublic: true
      },
      {
        key: 'currency',
        value: 'TWD',
        type: 'STRING',
        category: 'store',
        description: '商店貨幣',
        isPublic: true
      },
      {
        key: 'free_shipping_threshold',
        value: '1500',
        type: 'NUMBER',
        category: 'store',
        description: '免運費門檻',
        isPublic: true
      }
    ]

    for (const setting of settings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting
      })
      console.log(`✅ 設定創建: ${setting.key}`)
    }

    console.log('🎉 所有種子資料插入完成!')
    
  } catch (error) {
    console.error('❌ 種子資料插入失敗:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })