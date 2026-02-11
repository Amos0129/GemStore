#!/bin/bash

# 晶礦飾品 E-commerce 系統停止腳本

echo "🛑 停止晶礦飾品 E-commerce 系統..."
echo "========================================"

# 停止所有服務
docker-compose down

echo "✅ 所有服務已停止"
echo ""

# 如果加上 --clean 參數，清理所有相關資源
if [ "$1" = "--clean" ]; then
    echo "🧹 清理系統資源..."
    
    # 移除所有相關容器
    docker-compose down --rmi all --volumes --remove-orphans
    
    # 清理未使用的映像檔和網路
    docker system prune -f
    
    echo "✅ 系統資源清理完成"
fi

echo "🏁 系統已完全停止"