# 構建階段
FROM node:18-alpine as build-stage

WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 構建生產版本
RUN npm run build

# 生產階段
FROM nginx:alpine as production-stage

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 複製構建檔案
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]