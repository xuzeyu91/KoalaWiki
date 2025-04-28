FROM node:18-alpine

# 安装构建工具
RUN apk add --no-cache make gcc g++ python3

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目的所有文件到工作目录
COPY . .

# 如果项目需要构建，运行构建命令
RUN npm run build

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]