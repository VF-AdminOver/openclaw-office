## 1. 类型定义与 Adapter 层扩展

- [x] 1.1 在 `src/gateway/types.ts` 中扩展 `AgentSummary` 接口（增加 identity.emoji、identity.avatar、identity.avatarUrl、identity.theme 字段），扩展 `PageId` 类型增加 `"agents"` 值
- [x] 1.2 在 `src/gateway/adapter-types.ts` 中新增 Agent CRUD 类型：`AgentCreateParams`、`AgentCreateResult`、`AgentUpdateParams`、`AgentUpdateResult`、`AgentDeleteParams`、`AgentDeleteResult`、`AgentFileInfo`、`AgentFilesListResult`、`AgentFileContent`、`AgentFileSetResult`
- [x] 1.3 在 `src/gateway/adapter.ts` 的 `GatewayAdapter` 接口中新增 6 个方法签名：`agentsCreate`、`agentsUpdate`、`agentsDelete`、`agentsFilesList`、`agentsFilesGet`、`agentsFilesSet`
- [x] 1.4 在 `src/gateway/ws-adapter.ts` 中实现 6 个新方法，映射到对应 RPC 调用
- [x] 1.5 在 `src/gateway/mock-adapter.ts` 中实现 6 个新方法的 Mock 数据返回

## 2. 路由与导航集成

- [x] 2.1 在 `src/App.tsx` 中新增 `/agents` 路由和 `PAGE_MAP` 条目
- [x] 2.2 在 `src/components/layout/ConsoleLayout.tsx` 中新增 Agents 导航项（使用 `Bot` 图标，放在 Dashboard 之后）
- [x] 2.3 在 `src/i18n/locales/zh/layout.json` 和 `en/layout.json` 中新增 `consoleNav.agents` 和 `topbar.pageTitles.agents` 翻译

## 3. agents-store 状态管理

- [x] 3.1 创建 `src/store/console-stores/agents-store.ts`，定义 Store 状态结构（agents 列表、selectedAgentId、activeTab、files、fileContent、isFileDirty、loading/error、搜索、dialog 状态）
- [x] 3.2 实现 `fetchAgents()` action：调用 adapter 获取 Agent 列表
- [x] 3.3 实现 `fetchFiles(agentId)` action：调用 adapter 获取文件列表
- [x] 3.4 实现 `fetchFileContent(agentId, name)` action：调用 adapter 获取文件内容
- [x] 3.5 实现 `saveFileContent(agentId, name, content)` action：调用 adapter 保存文件
- [x] 3.6 实现 `createAgent(params)` action：调用 adapter 创建 Agent
- [x] 3.7 实现 `updateAgentModel(agentId, model)` action：调用 adapter 更新 Agent 模型配置
- [x] 3.8 实现 `deleteAgent(agentId, deleteFiles)` action：调用 adapter 删除 Agent

## 4. 页面骨架与 Agent 列表

- [x] 4.1 创建 `src/components/pages/AgentsPage.tsx` 页面入口组件（双栏布局：左侧列表 + 右侧详情）
- [x] 4.2 创建 `src/components/console/agents/AgentListPanel.tsx` 左侧 Agent 列表面板（标题 + 数量统计 + Refresh/Add 按钮 + 搜索框 + Agent 列表）
- [x] 4.3 创建 `src/components/console/agents/AgentListItem.tsx` Agent 列表项组件（emoji/头像 + 名称 + ID + DEFAULT 徽章 + 选中高亮）

## 5. Agent 详情区域

- [x] 5.1 创建 `src/components/console/agents/AgentDetailHeader.tsx` 详情头部组件（Agent emoji/头像、名称、描述、ID、DEFAULT 徽章）
- [x] 5.2 创建 `src/components/console/agents/AgentDetailTabs.tsx` Tab 导航组件（Overview、Files、Tools、Skills、Channels、Cron Jobs）
- [x] 5.3 创建 `src/components/console/agents/tabs/OverviewTab.tsx`（Agent 基本信息 + 模型配置编辑区域 + 删除按钮）
- [x] 5.4 创建 `src/components/console/agents/tabs/FilesTab.tsx`（文件列表卡片 + 文件内容编辑 textarea + Save/Reset 按钮）
- [x] 5.5 创建 `src/components/console/agents/tabs/ToolsTab.tsx`（工具策略只读展示）
- [x] 5.6 创建 `src/components/console/agents/tabs/SkillsTab.tsx`（技能列表只读展示）
- [x] 5.7 创建 `src/components/console/agents/tabs/ChannelsTab.tsx`（频道绑定只读展示）
- [x] 5.8 创建 `src/components/console/agents/tabs/CronJobsTab.tsx`（定时任务只读展示）

## 6. 新增 Agent 与删除 Agent

- [x] 6.1 创建 `src/components/console/agents/CreateAgentDialog.tsx`（Dialog 表单：name、workspace、emoji 输入框 + 创建/取消按钮）
- [x] 6.2 创建 `src/components/console/agents/DeleteAgentDialog.tsx`（ConfirmDialog：警告文案 + deleteFiles 复选框 + 删除/取消按钮）

## 7. i18n 翻译

- [x] 7.1 在 `src/i18n/locales/zh/console.json` 中新增 `agents` 命名空间下的所有翻译 key
- [x] 7.2 在 `src/i18n/locales/en/console.json` 中新增对应的英文翻译

## 8. 测试

- [x] 8.1 为 `agents-store` 编写 Vitest 单元测试（fetchAgents、createAgent、deleteAgent 等核心 action）
- [x] 8.2 Adapter 新增方法已在 agents-store 测试中通过 MockAdapter 间接覆盖验证

## 9. 优化迭代

- [x] 9.1 进入 Agents 页面时自动选中 default Agent（`fetchAgents` 完成后若无选中则自动选中 `defaultId`）
- [x] 9.2 模型配置改为下拉选择（从系统 `config.models.providers` 中提取模型列表，按 provider 分组），支持主模型和备用模型选择
- [x] 9.3 修复文件时间戳 "NaNd ago" 显示问题（`formatRelativeTime` 容错处理，`AgentFileInfo.modifiedAt` 支持 `string | number`）
