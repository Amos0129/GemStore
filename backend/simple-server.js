import http from 'http'
import url from 'url'
import path from 'path'

// 簡單的模擬數據
const products = [
  {
    id: 1,
    name: '紫水晶能量項鍊',
    category: 'necklace',
    price: 2800,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    description: '高品質紫水晶製成，能夠帶來平靜與智慧的能量'
  },
  {
    id: 2,
    name: '粉晶愛情手鍊',
    category: 'bracelet',
    price: 1680,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1584302179602-e4578db5a8c2?w=400',
    description: '溫柔的粉晶能夠招來愛情，提升人際關係'
  },
  {
    id: 3,
    name: '白水晶淨化戒指',
    category: 'ring',
    price: 3200,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    description: '純淨的白水晶能夠淨化負能量，帶來清明的思緒'
  }
]

const categories = [
  { id: 1, name: '項鍊', code: 'necklace', description: '各種款式的項鍊飾品' },
  { id: 2, name: '手鍊', code: 'bracelet', description: '各種手鍊飾品' },
  { id: 3, name: '戒指', code: 'ring', description: '各種戒指飾品' },
  { id: 4, name: '耳環', code: 'earring', description: '各種耳環飾品' }
]

const orders = [
  {
    id: 1,
    orderNumber: 'ORD20240001',
    customerName: '陳美玲',
    customerEmail: 'chen@example.com',
    totalAmount: 2800,
    status: 'paid',
    createdAt: '2024-02-08T10:30:00Z'
  }
]

// 設置 CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Content-Type', 'application/json')
}

// 解析 JSON body
function parseJSON(req, callback) {
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    try {
      const parsed = body ? JSON.parse(body) : {}
      callback(null, parsed)
    } catch (error) {
      callback(error, null)
    }
  })
}

// API 路由處理
function handleAPI(req, res) {
  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname
  const method = req.method

  // 處理 OPTIONS 請求 (CORS preflight)
  if (method === 'OPTIONS') {
    setCORSHeaders(res)
    res.statusCode = 200
    res.end()
    return
  }

  setCORSHeaders(res)

  // Health check
  if (pathname === '/health') {
    res.statusCode = 200
    res.end(JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }))
    return
  }

  // Products API
  if (pathname === '/api/products' && method === 'GET') {
    res.statusCode = 200
    res.end(JSON.stringify({
      success: true,
      data: products,
      total: products.length
    }))
    return
  }

  // Single product API
  if (pathname.startsWith('/api/products/') && method === 'GET') {
    const productId = parseInt(pathname.split('/')[3])
    const product = products.find(p => p.id === productId)
    
    if (product) {
      res.statusCode = 200
      res.end(JSON.stringify({
        success: true,
        data: product
      }))
    } else {
      res.statusCode = 404
      res.end(JSON.stringify({
        success: false,
        message: '商品不存在'
      }))
    }
    return
  }

  // Categories API
  if (pathname === '/api/categories' && method === 'GET') {
    res.statusCode = 200
    res.end(JSON.stringify({
      success: true,
      data: categories
    }))
    return
  }

  // Orders API
  if (pathname === '/api/orders' && method === 'GET') {
    res.statusCode = 200
    res.end(JSON.stringify({
      success: true,
      data: orders,
      total: orders.length
    }))
    return
  }

  // Create order API
  if (pathname === '/api/orders' && method === 'POST') {
    parseJSON(req, (error, data) => {
      if (error) {
        res.statusCode = 400
        res.end(JSON.stringify({
          success: false,
          message: '無效的 JSON 格式'
        }))
        return
      }

      const newOrder = {
        id: orders.length + 1,
        orderNumber: `ORD${new Date().getFullYear()}${String(orders.length + 1).padStart(4, '0')}`,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      orders.push(newOrder)

      res.statusCode = 201
      res.end(JSON.stringify({
        success: true,
        data: newOrder,
        message: '訂單建立成功'
      }))
    })
    return
  }

  // User authentication (mock)
  if (pathname === '/api/auth/login' && method === 'POST') {
    parseJSON(req, (error, data) => {
      if (error) {
        res.statusCode = 400
        res.end(JSON.stringify({
          success: false,
          message: '無效的 JSON 格式'
        }))
        return
      }

      // Mock login logic
      if (data.email === 'admin@crystal-jewelry.com' && data.password === 'admin123') {
        res.statusCode = 200
        res.end(JSON.stringify({
          success: true,
          data: {
            token: 'mock-jwt-token',
            user: {
              id: 1,
              name: '管理員',
              email: data.email,
              role: 'admin'
            }
          },
          message: '登入成功'
        }))
      } else {
        res.statusCode = 401
        res.end(JSON.stringify({
          success: false,
          message: '帳號或密碼錯誤'
        }))
      }
    })
    return
  }

  // Cart API (mock)
  if (pathname.startsWith('/api/cart')) {
    res.statusCode = 200
    res.end(JSON.stringify({
      success: true,
      data: [],
      message: 'Cart API (mock)'
    }))
    return
  }

  // Wishlist API (mock)
  if (pathname.startsWith('/api/wishlist')) {
    res.statusCode = 200
    res.end(JSON.stringify({
      success: true,
      data: [],
      message: 'Wishlist API (mock)'
    }))
    return
  }

  // 404 - Not Found
  res.statusCode = 404
  res.end(JSON.stringify({
    success: false,
    message: 'API 端點不存在',
    path: pathname
  }))
}

// 建立 HTTP 服務器
const server = http.createServer((req, res) => {
  try {
    handleAPI(req, res)
  } catch (error) {
    console.error('Server error:', error)
    setCORSHeaders(res)
    res.statusCode = 500
    res.end(JSON.stringify({
      success: false,
      message: '內部服務器錯誤'
    }))
  }
})

// 啟動服務器
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Simple API Server running on port ${PORT}`)
  console.log(`📖 Health check: http://localhost:${PORT}/health`)
  console.log(`🛒 Products API: http://localhost:${PORT}/api/products`)
  console.log(`📂 Categories API: http://localhost:${PORT}/api/categories`)
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`)
})

// 優雅關閉
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  server.close(() => {
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  server.close(() => {
    process.exit(0)
  })
})