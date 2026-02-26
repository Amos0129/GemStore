# 電商後台管理系統資料庫結構分析

## 📋 功能需求分析結果

根據後台管理介面分析，需要支援以下功能：

### 1. 儀表板統計
- ✅ 今日訂單數
- ✅ 今日營業額  
- ✅ 待處理訂單
- ✅ 會員總數
- ✅ 銷售趨勢圖表
- ✅ 商品分類銷售分佈
- ✅ 最新訂單列表
- ✅ 熱銷商品排行

### 2. 商品管理
- ✅ 商品CRUD操作
- ✅ 商品分類管理（樹狀結構）
- ✅ 商品圖片管理
- ✅ 商品屬性（顏色、尺寸等）
- ✅ 商品標籤系統
- ✅ 庫存管理與警告
- ✅ SEO設定（Meta標題、描述）

### 3. 訂單管理  
- ✅ 訂單列表與篩選
- ✅ 訂單狀態管理
- ✅ 訂單詳情查看
- ✅ 訂單統計資料
- ✅ 發貨管理
- ✅ 訂單狀態歷史記錄

### 4. 會員管理
- ✅ 會員列表與搜尋
- ✅ 會員等級制度
- ✅ 會員統計資料
- ✅ 會員狀態控制
- ✅ 消費記錄追蹤

### 5. 財務報表
- ✅ 收入趨勢分析
- ✅ 銷售分佈圖表
- ✅ 支出分析
- ✅ 月度對比
- ✅ 熱銷商品統計
- ✅ 財務記錄管理

### 6. 系統設定
- ✅ 基本網站設定
- ✅ 商店營運設定  
- ✅ 付款方式設定
- ✅ 物流設定
- ✅ 通知設定
- ✅ SEO設定

## 🗄️ 資料庫表格結構

### 核心用戶與權限管理
| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|----------|
| `users` | 用戶管理 | role, membershipLevel, totalSpent |
| `admin_logs` | 管理員操作記錄 | action, resource, details |

### 商品管理系統
| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|----------|
| `categories` | 商品分類（樹狀） | parentId, sortOrder, isActive |
| `products` | 商品主表 | price, stock, lowStockThreshold |
| `product_images` | 商品圖片 | url, sortOrder, isMain |
| `attributes` | 商品屬性定義 | name, type, values |
| `product_attributes` | 商品屬性值 | value, extraPrice |
| `tags` | 標籤系統 | name, color |
| `inventory_logs` | 庫存記錄 | type, quantity, reason |

### 訂單管理系統  
| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|----------|
| `orders` | 訂單主表 | status, totalAmount, paymentStatus |
| `order_items` | 訂單項目 | quantity, price, total |
| `order_status_history` | 訂單狀態歷史 | status, note, createdAt |
| `addresses` | 收貨地址 | type, isDefault |

### 購物車與收藏
| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|----------|
| `cart_items` | 購物車 | quantity, addedAt |
| `wishlist` | 收藏清單 | addedAt |
| `reviews` | 商品評價 | rating, content, isVisible |

### 系統設定與通知
| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|----------|
| `system_settings` | 系統設定 | key, value, type, isPublic |
| `notifications` | 通知系統 | type, title, message |
| `user_notifications` | 用戶通知關聯 | isRead, readAt |

### 財務與統計
| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|----------|
| `finance_records` | 財務記錄 | type, amount, category |
| `daily_stats` | 每日統計 | date, revenue, orders, customers |

### 營銷系統
| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|----------|
| `coupons` | 優惠券管理 | code, type, value, validFrom |

### 內容與媒體管理
| 表格名稱 | 用途 | 關鍵欄位 |
|---------|------|----------|
| `pages` | 網站頁面 | title, slug, content, metaTitle |
| `media_files` | 檔案管理 | filename, url, category |

## 🔗 關聯性設計

### 一對多關係
- User → Address (用戶可有多個地址)
- User → Order (用戶可有多筆訂單)  
- Category → Product (分類下有多個商品)
- Product → ProductImage (商品有多張圖片)
- Order → OrderItem (訂單包含多個商品項目)

### 多對多關係
- Product ↔ Tag (商品與標籤)
- User ↔ Notification (用戶通知)

### 自關聯
- Category → Category (分類樹狀結構)

## 📊 索引優化建議

```sql
-- 效能關鍵索引
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_daily_stats_date ON daily_stats(date);
CREATE INDEX idx_products_featured_active ON products(is_featured, is_active);
```

## 🚀 特色功能

### 1. 正規化設計
- 第三正規形式，避免資料冗余
- 適當的反正規化處理（如 totalSpent）
- 良好的外鍵約束

### 2. 可擴展性
- 商品屬性系統支援動態擴展
- 通知系統支援多種類型
- 設定系統支援多種資料類型

### 3. 完整性
- 軟刪除支援（isActive）
- 審計日誌（AdminLog）
- 狀態歷史追蹤

### 4. 效能考量
- 適當的索引設計
- 分頁查詢支援
- 統計資料預先計算

## 💡 使用建議

1. **定期維護**: 建議定期清理過期的日誌和統計資料
2. **備份策略**: 重要業務數據需要定期備份
3. **監控**: 建議監控慢查詢和資料庫效能
4. **擴展**: 可根據業務需求增加新的設定項目和通知類型

這個schema完全支援後台管理的所有功能需求，並且具有良好的可維護性和擴展性。