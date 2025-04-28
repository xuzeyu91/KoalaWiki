# KoalaWiki

<div align="center">
  <img src="https://github.com/user-attachments/assets/f91e3fe7-ef4d-4cfb-8b57-36eb1c449238" alt="KoalaWiki Logo" width="200" />
  <h3>AI驱动的代码知识库</h3>
</div>

## 📖 项目介绍

KoalaWiki 是一个强大的AI驱动代码知识库平台，可以自动分析您的代码仓库，生成详细的文档和见解，帮助开发团队更深入地理解代码结构和工作原理。无论是新加入团队的开发人员快速上手，还是项目维护者梳理代码逻辑，KoalaWiki 都能提供智能化的辅助。

## ✨ 核心功能

- **仓库管理**：支持添加和管理多个Git代码仓库
- **AI代码分析**：利用先进的AI技术分析代码结构和关系
- **自动文档生成**：自动为代码库生成详细的文档
- **知识库导航**：直观的目录树结构，便于浏览和查找
- **支持多种模型**：集成OpenAI等多种AI模型，灵活配置

## 🔧 技术栈

### 后端
- .NET 9.0
- Microsoft Semantic Kernel
- Entity Framework Core
- FastService API
- SQLite 数据库
- LibGit2Sharp

### 前端
- Next.js 15.3
- React 19
- Ant Design 5.24
- TypeScript
- Markdown 渲染支持

## 🚀 快速开始

### 系统要求
- .NET 9.0 SDK
- Node.js 18+

### 后端安装
```bash
# 克隆仓库
git clone https://github.com/AIDotNet/koalawiki.git
cd koalawiki

# 启动后端API
cd src/KoalaWiki
dotnet run
```

### 前端安装
```bash
# 进入前端目录
cd web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 http://localhost:3000 启动。

## 🖥️ 使用说明

1. **添加仓库**：点击"添加新仓库"按钮，填写Git仓库地址、分支等信息
2. **配置AI模型**：选择合适的AI模型和配置参数 
3. **浏览知识库**：仓库分析完成后，可通过导航树浏览代码文档
4. **查看代码解析**：查看AI生成的代码结构分析和文档说明

## 🤝 参与贡献

欢迎参与KoalaWiki项目的开发！您可以通过以下方式贡献：

1. 提交Issue报告问题或建议新功能
2. 提交Pull Request贡献代码
3. 改进文档和用户指南

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 📚 相关资源

- [项目博客](https://github.com/AIDotNet/koalawiki/blog)
- [API文档](https://github.com/AIDotNet/koalawiki/api-docs)
- [使用教程](https://github.com/AIDotNet/koalawiki/tutorials)

---

<div align="center">
  <sub>由 ❤️ AIDotNet 团队开发</sub>
</div>
