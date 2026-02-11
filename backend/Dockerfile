# 使用官方 Node.js 18 Alpine 作為基底映像
FROM node:18-alpine

# 安裝 curl 和 postgresql-client (用於健康檢查和資料庫連線)
RUN apk add --no-cache curl postgresql-client

# 設定工作目錄
WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴 (使用 npm install 而不是 ci，因為沒有 lock 文件)
RUN npm install

# 複製應用程式碼
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 建立 uploads 目錄
RUN mkdir -p uploads

# 複製啟動腳本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 建立非 root 用戶
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 更改檔案擁有者
RUN chown -R nodejs:nodejs /app
USER nodejs

# 暴露端口
EXPOSE 5000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# 啟動應用程式
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]