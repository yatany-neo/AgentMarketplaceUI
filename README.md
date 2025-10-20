# Agent Marketplace UI

一个完整的 AI Agent Marketplace 用户界面演示系统，展示 Agent 开发者、MCP Tool 开发者和运营人员如何使用 Marketplace 平台。

## 🎯 项目概述

Agent Marketplace UI 是一个基于 React + TypeScript + Ant Design 构建的现代化 Web 应用，用于演示 AI Agent Marketplace 的完整工作流程和用户界面。

### 核心功能

- **Agent 开发者界面**: 监控 AI Agent 执行状态，了解 Marketplace 自动工具推荐
- **MCP Tool 开发者界面**: 管理 MCP 工具，监控工具性能和使用情况
- **运营人员界面**: 系统运营监控，性能分析和故障诊断
- **用户指南**: 详细的使用说明和用户旅程演示

## 🚀 在线演示

**访问地址**: https://agentmarketplaceui.z13.web.core.windows.net/

## 📋 功能特性

### Agent 开发者功能
- ✅ **多 Agent 管理**: 查看和管理多个 AI Agent
- ✅ **需求澄清流程**: 展示 AI Agent 需求 → Marketplace 澄清的完整过程
- ✅ **任务分解流程**: 展示需求如何分解为可执行的子任务
- ✅ **工具推荐展示**: 显示 Marketplace 自动推荐的工具选择
- ✅ **备选工具分析**: 展示被考虑但未选择的工具及原因
- ✅ **执行监控**: 实时查看任务执行进度和状态
- ✅ **执行历史**: 查看历史执行记录和统计分析
- ✅ **工具排名**: 基于多维度指标的工具排名和推荐

### MCP Tool 开发者功能
- ✅ **工具管理**: 注册、更新和管理 MCP 工具
- ✅ **性能监控**: 监控工具的使用情况和性能指标
- ✅ **数据分析**: 分析工具的使用趋势和效果
- ✅ **执行历史**: 查看工具的任务处理历史

### 运营人员功能
- ✅ **系统监控**: 整体系统健康度和性能监控
- ✅ **告警管理**: 系统告警和异常处理
- ✅ **性能分析**: Agent 和工具性能分析
- ✅ **失败分析**: 失败请求分析和改进建议
- ✅ **工具覆盖度**: 分析工具覆盖度和功能缺口

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design 5.x
- **状态管理**: React Hooks (useState)
- **构建工具**: Create React App
- **部署平台**: Azure Static Web Apps
- **代码质量**: ESLint + TypeScript

## 📁 项目结构

```
AgentMarketplaceUI/
├── agent-marketplace-demo/          # 主应用目录
│   ├── public/                      # 静态资源
│   ├── src/                         # 源代码
│   │   ├── components/              # React 组件
│   │   │   ├── HistoryPage.tsx      # 执行历史页面
│   │   │   ├── MCPToolDeveloperView.tsx  # MCP 工具开发者界面
│   │   │   ├── MCPToolHistoryPage.tsx    # MCP 工具历史页面
│   │   │   ├── OperationsView.tsx   # 运营人员界面
│   │   │   ├── RequestForm.tsx      # 需求提交表单
│   │   │   ├── ToolRankingView.tsx  # 工具排名页面
│   │   │   └── UserGuidePage.tsx    # 用户指南页面
│   │   ├── App.tsx                  # 主应用组件
│   │   └── App.css                  # 样式文件
│   ├── package.json                 # 项目配置
│   └── README.md                    # 应用说明
├── requirements_analysis.md         # 需求分析文档
└── README.md                        # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js 16+ 
- npm 或 yarn

### 安装依赖

```bash
cd agent-marketplace-demo
npm install
```

### 本地开发

```bash
npm start
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 部署到 Azure

```bash
# 安装 Azure CLI
npm install -g @azure/cli

# 登录 Azure
az login

# 部署到 Azure Static Web Apps
az storage blob upload-batch --account-name "your-storage-account" --source "build" --destination "\$web"
```

## 📊 演示数据

项目包含三个真实的测试用例：

1. **Microsoft Redmond 到 Walmart 骑行查询**: 展示地理位置和路线规划工具的使用
2. **Doctor Who 第9季第11集迷宫场景查询**: 展示搜索和信息检索工具的使用  
3. **Justin Bieber YouTube 评论获取**: 展示多媒体内容处理工具的使用

每个用例都包含：
- 需求澄清流程
- 任务分解过程
- 工具推荐和备选分析
- 执行监控和历史记录

## 🎨 设计理念

### 用户体验
- **直观导航**: 清晰的菜单结构和页面布局
- **实时反馈**: 动态状态更新和进度显示
- **透明决策**: 详细的工具选择理由和备选分析
- **专业界面**: 现代化的 UI 设计和交互体验

### 技术架构
- **组件化设计**: 可复用的 React 组件
- **类型安全**: 完整的 TypeScript 类型定义
- **响应式布局**: 适配不同屏幕尺寸
- **性能优化**: 代码分割和懒加载

## 📈 功能亮点

### 智能工具推荐
- 基于多维度指标的工具排名
- 详细的推荐理由和备选分析
- 透明的算法权重和评分机制

### 完整工作流程
- 从需求提交到执行完成的完整链路
- 每个步骤的详细展示和说明
- 失败原因分析和改进建议

### 多角色支持
- Agent 开发者：监控和优化
- MCP Tool 开发者：工具管理和分析
- 运营人员：系统监控和运营决策

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 创建 [Issue](https://github.com/your-username/AgentMarketplaceUI/issues)
- 发送邮件至: your-email@example.com

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和设计师！

---

**注意**: 这是一个演示项目，用于展示 Agent Marketplace 的概念和用户界面设计。实际的生产环境需要完整的后端 API 和数据存储系统。
