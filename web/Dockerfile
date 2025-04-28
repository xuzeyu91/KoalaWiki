FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json到工作目录
COPY package*.json ./

# 安装构建依赖
RUN apk add --no-cache make gcc g++ python3 && \
    npm ci && \
    # 清理npm缓存
    npm cache clean --force

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 第二阶段：生产环境
FROM node:18-alpine AS production

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 仅安装生产依赖
RUN npm ci --only=production && \
    npm cache clean --force

# 从构建阶段复制构建结果
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]