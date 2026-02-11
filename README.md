# 晶礦飾品 - 水晶珠寶電商網站

一個完整的水晶珠寶電商平台，包含前台購物網站、後台管理系統和 RESTful API。

## 🚀 快速開始

### 一鍵部署 (推薦)

使用 Docker Compose 快速啟動所有服務：

```bash
# 1. 克隆專案
git clone <repository-url>
cd shop

# 2. 啟動所有服務
docker-compose up -d

# 3. 等待服務啟動完成，然後訪問：
# 前台：http://localhost:3001
# 後台：http://localhost:3002
# API：http://localhost:5000
```

### 本地開發

如果要進行本地開發：

```bash
# 安裝依賴
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install

# 設定環境變數
cp backend/.env.example backend/.env
# 編輯 .env 檔案設定資料庫連線等資訊

# 啟動後端 API
cd backend && npm run dev

# 啟動前台 (新終端)
cd frontend && npm run dev

# 啟動後台 (新終端)
cd admin && npm run dev
```

## 🏗️ 專案架構

```
shop/
├── backend/          # Node.js + Express + Prisma API
├── frontend/         # Vue 3 前台購物網站
├── admin/           # Vue 3 後台管理系統
└── docker-compose.yml
```

## 🛠️ 技術棧

### 後端 API
- **Node.js 18** - JavaScript 運行環境
- **Express.js** - Web 框架
- **Prisma ORM** - 資料庫 ORM
- **PostgreSQL** - 主要資料庫
- **JWT** - 身份驗證
- **Joi** - 資料驗證
- **bcrypt** - 密碼加密

### 前端
- **Vue 3** - 前端框架
- **Composition API** - Vue 3 組合式 API
- **Pinia** - 狀態管理
- **Vue Router** - 路由管理
- **Vite** - 建構工具
- **Tailwind CSS** - CSS 框架

### 部署
- **Docker** - 容器化
- **Docker Compose** - 多容器編排
- **Nginx** - Web 伺服器 (生產環境)

## 📱 功能特色

### 🛍️ 前台功能
- 商品瀏覽與搜尋
- 購物車管理
- 用戶註冊/登入
- 訂單管理
- 收藏清單
- 商品評價
- 響應式設計 (手機版優化)

### 💼 後台功能
- 商品管理 (CRUD)
- 分類管理
- 訂單管理
- 用戶管理
- 數據統計
- 權限控制

### 🔌 API 功能
- RESTful API 設計
- JWT 身份驗證
- 資料驗證
- 錯誤處理
- API 文檔

## 🎨 設計特色

- **馬卡龍色彩主題** - 柔和的紫色調 (#8B5CF6, #C4B5FD, #F8BBD9)
- **響應式設計** - 完美支援桌面和手機版
- **現代化 UI** - 簡潔優雅的使用者介面
- **流暢動畫** - 平滑的頁面轉場效果

## 📊 已實現的 API

### ✅ 已完成
- 🔐 **身份驗證** (Auth) - 註冊、登入、密碼重設
- 🛍️ **商品管理** (Products) - 完整 CRUD + 進階篩選
- 🛒 **購物車** (Cart) - 加入、更新、移除、清空

### 🚧 待實現
- 💝 收藏清單 (Wishlist)
- 📍 地址管理 (Addresses)
- 📦 訂單管理 (Orders)
- ⭐ 商品評價 (Reviews)
- 💳 付款處理 (Payments)
- 📊 統計分析 (Analytics)
- 👥 用戶管理 (Users)
- 📂 檔案上傳 (Upload)
- 🏷️ 標籤管理 (Tags)

## 🔧 環境變數

在 `backend/.env` 中設定：

```env
# 資料庫
DATABASE_URL="postgresql://user:password@localhost:5432/crystal_jewelry_db"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m

# 應用設定
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3001,http://localhost:3002

# 郵件服務 (可選)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📝 API 使用範例

### 註冊用戶
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "王",
    "lastName": "小明"
  }'
```

### 獲取商品列表
```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=12&category=戒指"
```

### 加入購物車
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "product_id",
    "quantity": 2
  }'
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License