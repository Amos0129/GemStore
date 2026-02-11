#!/bin/bash

# 晶礦飾品 E-commerce 系統部署腳本

echo "🚀 啟動晶礦飾品 E-commerce 系統..."
echo "========================================"

# 檢查 Docker 是否安裝
if ! command -v docker &> /dev/null; then
    echo "❌ 錯誤: Docker 未安裝"
    echo "請先安裝 Docker: https://www.docker.com/get-started"
    exit 1
fi

# 檢查 Docker Compose 是否安裝
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 錯誤: Docker Compose 未安裝"
    echo "請先安裝 Docker Compose"
    exit 1
fi

# 檢查 Docker 是否運行
if ! docker info &> /dev/null; then
    echo "❌ 錯誤: Docker 未運行"
    echo "請啟動 Docker Desktop 或 Docker daemon"
    exit 1
fi

echo "✅ Docker 環境檢查通過"
echo ""

# 停止舊容器 (如果存在)
echo "🛑 停止舊容器..."
docker-compose down

# 清理舊映像檔 (可選)
if [ "$1" = "--clean" ]; then
    echo "🧹 清理舊映像檔..."
    docker-compose down --rmi all --volumes --remove-orphans
fi

# 構建並啟動服務
echo "🔨 構建並啟動服務..."
docker-compose up --build -d

# 等待服務啟動
echo "⏳ 等待服務啟動..."
sleep 10

# 檢查服務狀態
echo "🔍 檢查服務狀態..."
echo ""

# 後端 API 健康檢查
echo "🔹 後端 API 狀態:"
if curl -f -s http://localhost:5000/health > /dev/null; then
    echo "  ✅ 後端 API: 正常運行 (http://localhost:5000)"
else
    echo "  ❌ 後端 API: 啟動失敗"
fi

# 前台網站檢查
echo "🔹 前台網站狀態:"
if curl -f -s http://localhost:3001 > /dev/null; then
    echo "  ✅ 前台網站: 正常運行 (http://localhost:3001)"
else
    echo "  ❌ 前台網站: 啟動失敗"
fi

# 後台管理檢查
echo "🔹 後台管理狀態:"
if curl -f -s http://localhost:3002 > /dev/null; then
    echo "  ✅ 後台管理: 正常運行 (http://localhost:3002)"
else
    echo "  ❌ 後台管理: 啟動失敗"
fi

echo ""
echo "🎉 系統部署完成！"
echo "========================================"
echo "📱 前台網站: http://localhost:3001"
echo "🛠️  後台管理: http://localhost:3002"
echo "🔌 後端 API: http://localhost:5000"
echo ""
echo "📋 其他命令:"
echo "  查看容器狀態: docker-compose ps"
echo "  查看日誌: docker-compose logs [service_name]"
echo "  停止服務: docker-compose down"
echo "  重啟服務: docker-compose restart"
echo ""

# 顯示容器狀態
docker-compose ps