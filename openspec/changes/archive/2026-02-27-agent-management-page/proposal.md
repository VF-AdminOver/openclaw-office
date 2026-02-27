## Why

OpenClaw Office 当前仅在 Office 视图的 Sidebar 中展示 Agent 的运行时状态（活跃/空闲/工具调用等），不具备 Agent 的配置管理能力。用户需要切换到 Gateway 原生 Web UI（`http://localhost:18789/agents`）才能查看和编辑 Agent 的核心文件（SOUL.md、TOOLS.md 等）、工具策略、技能绑定、频道路由和定时任务。

这破坏了 OpenClaw Office 作为"统一管理面板"的定位。本次变更将 Gateway 原生 Agent 管理页面的核心功能复刻到 Console 中，并在此基础上增加**添加新 Agent** 和**Agent对应的模型配置**能力，使用户可以在 OpenClaw Office 内完成完整的 Agent 生命周期管理。

## What Changes

- **新增 `/agents` 控制台页面**，在 ConsoleLayout 侧边栏中加入 Agents 导航项
- **Agent 列表侧边栏**：展示所有已配置的 Agent，含 emoji/头像、名称、类型标识、DEFAULT 徽章，支持搜索过滤
- **Agent 详情区域**（选中 Agent 后展示），包含以下 Tab 页：
  - **Overview**：Agent 基本信息概览（ID、名称、workspace 路径、模型配置）
  - **Files**：核心文件管理（AGENTS.md、SOUL.md、TOOLS.md、IDENTITY.md、USER.md、HEARTBEAT.md），支持查看与编辑文件内容
  - **Tools**：Agent 工具策略展示（profile、allow/deny 列表）
  - **Skills**：Agent 绑定的技能列表
  - **Channels**：Agent 关联的频道路由（bindings）
  - **Cron Jobs**：Agent 关联的定时任务
- **添加新 Agent**：通过表单创建新 Agent（名称、workspace、emoji/头像），调用 `agents.create` RPC
- **模型配置**：在 Overview Tab 中展示和编辑 Agent 的模型配置（primary model、fallbacks），调用 `agents.update` RPC
- **删除 Agent**：支持删除非 default Agent，可选是否同时删除文件
- **扩展 `GatewayAdapter` 接口**：新增 `agentsCreate`、`agentsUpdate`、`agentsDelete`、`agentsFilesList`、`agentsFilesGet`、`agentsFilesSet` 方法
- **新增 `agents-store`**：管理 Agent 管理页面的 UI 状态和数据

## Capabilities

### New Capabilities

- `agent-management-page`：Agent 管理控制台页面，包含 Agent 列表、详情 Tab 视图、CRUD 操作、文件编辑、模型配置

### Modified Capabilities

- `gateway-adapter`：扩展 GatewayAdapter 接口，新增 Agent CRUD 和文件管理的 RPC 方法
- `console-routing`：新增 `/agents` 路由和导航项

## Impact

- **新增文件**：
  - `src/components/panels/AgentsPage.tsx` — 页面入口
  - `src/components/panels/agents/` — Agent 管理子组件（列表、详情 Tabs、表单等）
  - `src/store/agents-store.ts` — Agent 管理状态
- **修改文件**：
  - `src/gateway/adapter.ts` — 新增 RPC 方法接口
  - `src/gateway/ws-adapter.ts` — 实现新 RPC 方法
  - `src/gateway/mock-adapter.ts` — Mock 实现
  - `src/gateway/adapter-types.ts` — 新增类型定义
  - `src/gateway/types.ts` — 扩展 `AgentSummary`、`PageId`、新增 Agent CRUD 响应类型
  - `src/App.tsx` — 新增路由
  - `src/components/layout/ConsoleLayout.tsx` — 新增导航项
  - `src/i18n/locales/zh/console.json` + `en/console.json` — 新增翻译
  - `src/i18n/locales/zh/layout.json` + `en/layout.json` — 新增导航翻译
- **依赖**：无新增外部依赖，使用现有 Tailwind CSS + lucide-react 图标
