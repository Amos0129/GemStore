import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import 'express-async-errors'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'
import wishlistRoutes from './routes/wishlist.js'
import addressRoutes from './routes/addresses.js'
import reviewRoutes from './routes/reviews.js'
import uploadRoutes from './routes/upload.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import authMiddleware from './middleware/auth.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Middleware
app.use(limiter)
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files
app.use('/uploads', express.static('uploads'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/upload', uploadRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Graceful shutdown
const server = app.listen(PORT, () => {
  console.log(`🚀 Crystal Jewelry API Server running on port ${PORT}`)
  console.log(`📖 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🛒 API Documentation: http://localhost:${PORT}/api`)
  }
})

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`)
  server.close(() => {
    console.log('✅ HTTP server closed.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export default app