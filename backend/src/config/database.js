import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
)

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully')
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('🔄 Database synced')
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error)
    process.exit(1)
  }
}

export default sequelize