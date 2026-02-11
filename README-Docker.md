# 晶礦飾品 E-commerce 系統 - Docker 容器化部署

## 🚀 一鍵部署指南

### 前置要求
- Docker
- Docker Compose

### 快速啟動
```bash
# 1. 進入專案目錄
cd shop

# 2. 一鍵啟動
chmod +x start.sh
./start.sh

# 3. 訪問系統
# 前台: http://localhost:3001
# 後台: http://localhost:3002
# API: http://localhost:5000
```

### 管理命令
```bash
./start.sh          # 啟動系統
./start.sh --clean   # 清理重建
./stop.sh            # 停止系統
./stop.sh --clean    # 完全清理
```

### 系統架構
- **前台**: Vue 3 + Tailwind (Port: 3001)
- **後台**: Vue 3 + Element Plus (Port: 3002)  
- **後端**: Node.js + Express (Port: 5000)

### 容器說明
- crystal-jewelry-frontend: 客戶購物網站
- crystal-jewelry-admin: 管理員後台
- crystal-jewelry-api: RESTful API 服務

完整說明請參考主 README 文件。