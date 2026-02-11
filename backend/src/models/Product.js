import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  minStock: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: {
      min: 0
    }
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  attributes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isDigital: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  badge: {
    type: DataTypes.ENUM('new', 'hot', 'sale', 'limited'),
    allowNull: true
  },
  sales: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  seoTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  seoDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  seoKeywords: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'products',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      unique: true,
      fields: ['sku']
    },
    {
      fields: ['categoryId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isFeatured']
    },
    {
      fields: ['price']
    },
    {
      fields: ['publishedAt']
    }
  ]
})

// 虛擬欄位
Product.addHook('afterFind', (products) => {
  if (Array.isArray(products)) {
    products.forEach(product => {
      if (product) {
        product.dataValues.discountPercentage = product.originalPrice 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0
        product.dataValues.isOnSale = product.originalPrice && product.originalPrice > product.price
        product.dataValues.isLowStock = product.stock <= product.minStock
        product.dataValues.isOutOfStock = product.stock === 0
      }
    })
  } else if (products) {
    products.dataValues.discountPercentage = products.originalPrice 
      ? Math.round(((products.originalPrice - products.price) / products.originalPrice) * 100)
      : 0
    products.dataValues.isOnSale = products.originalPrice && products.originalPrice > products.price
    products.dataValues.isLowStock = products.stock <= products.minStock
    products.dataValues.isOutOfStock = products.stock === 0
  }
})

// 實例方法
Product.prototype.updateStock = async function(quantity) {
  this.stock = Math.max(0, this.stock - quantity)
  if (quantity > 0) {
    this.sales += quantity
  }
  return this.save()
}

Product.prototype.updateRating = async function() {
  const { Review } = await import('./index.js')
  const reviews = await Review.findAll({
    where: { productId: this.id },
    attributes: ['rating']
  })
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    this.rating = (totalRating / reviews.length).toFixed(2)
    this.reviewCount = reviews.length
  } else {
    this.rating = 0
    this.reviewCount = 0
  }
  
  return this.save()
}

export default Product