#!/bin/bash

echo "🚀 設置晶礦飾品電商平台..."

# 顏色定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安裝。請先安裝 Node.js (建議版本 18+)${NC}"
    exit 1
fi

# 檢查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安裝。請先安裝 npm${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 和 npm 已安裝${NC}"

# 設置前端
echo -e "${BLUE}📦 安裝前端依賴...${NC}"
cd frontend
cp .env.example .env
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 前端依賴安裝完成${NC}"
else
    echo -e "${RED}❌ 前端依賴安裝失敗${NC}"
    exit 1
fi

# 設置後端
echo -e "${BLUE}📦 安裝後端依賴...${NC}"
cd ../backend
cp .env.example .env
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 後端依賴安裝完成${NC}"
else
    echo -e "${RED}❌ 後端依賴安裝失敗${NC}"
    exit 1
fi

# 設置後台管理
echo -e "${BLUE}📦 設置後台管理系統...${NC}"
cd ../admin
cp .env.example .env

npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 後台管理依賴安裝完成${NC}"
else
    echo -e "${RED}❌ 後台管理依賴安裝失敗${NC}"
    exit 1
fi

cd ..

echo -e "${GREEN}🎉 安裝完成！${NC}"
echo ""
echo -e "${BLUE}📋 下一步：${NC}"
echo -e "1. 設置資料庫配置 (backend/.env)"
echo -e "2. 啟動後端服務: ${GREEN}cd backend && npm run dev${NC}"
echo -e "3. 啟動前端服務: ${GREEN}cd frontend && npm run dev${NC}"
echo -e "4. 啟動後台管理: ${GREEN}cd admin && npm run dev${NC}"
echo ""
echo -e "${BLUE}🌐 預設端口：${NC}"
echo -e "- 前端: http://localhost:3000"
echo -e "- 後端: http://localhost:5000"
echo -e "- 後台: http://localhost:3001"
echo ""
echo -e "${GREEN}🚀 開始開發吧！${NC}"