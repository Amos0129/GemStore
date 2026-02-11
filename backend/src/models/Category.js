import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Category = sequelize.define('Category', {
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
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'fas fa-gem'
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  }
}, {
  tableName: 'categories',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['parentId']
    },
    {
      fields: ['isActive']
    }
  ]
})

// 自關聯關係
Category.hasMany(Category, { 
  as: 'children',
  foreignKey: 'parentId',
  onDelete: 'CASCADE'
})

Category.belongsTo(Category, {
  as: 'parent',
  foreignKey: 'parentId'
})

// 實例方法
Category.prototype.getFullPath = async function() {
  let path = [this.name]
  let current = this
  
  while (current.parentId) {
    current = await Category.findByPk(current.parentId)
    if (current) {
      path.unshift(current.name)
    } else {
      break
    }
  }
  
  return path.join(' > ')
}

export default Category