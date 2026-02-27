## MODIFIED Requirements

### Requirement: GatewayAdapter 统一接口

系统 SHALL 定义 `GatewayAdapter` TypeScript 接口，包含与 OpenClaw Gateway 方法一一对应的类型安全方法签名。

#### Scenario: 接口方法覆盖所有 Gateway 领域

- **WHEN** GatewayAdapter 接口定义完成
- **THEN** 接口 SHALL 包含以下领域的方法签名：
  - 连接管理：`connect()`, `disconnect()`, `onEvent()`
  - Chat：`chatHistory()`, `chatSend()`, `chatAbort()`
  - Sessions：`sessionsList()`, `sessionsPreview()`
  - Channels：`channelsStatus()`, `channelsLogout()`, `webLoginStart()`, `webLoginWait()`
  - Skills：`skillsStatus()`, `skillsInstall()`, `skillsUpdate()`
  - Cron：`cronList()`, `cronAdd()`, `cronUpdate()`, `cronRemove()`, `cronRun()`
  - Agents：`agentsList()`, `agentsCreate()`, `agentsUpdate()`, `agentsDelete()`, `agentsFilesList()`, `agentsFilesGet()`, `agentsFilesSet()`
  - Tools：`toolsCatalog()`
  - Usage：`usageStatus()`
  - Config / Status / Update：`configGet()`, `configPatch()`, `configSchema()`, `statusSummary()`, `updateRun()`

#### Scenario: Agent CRUD 方法签名

- **WHEN** 调用 Agent 管理相关方法
- **THEN** 方法签名 SHALL 如下：
  - `agentsCreate(params: AgentCreateParams): Promise<AgentCreateResult>`
  - `agentsUpdate(params: AgentUpdateParams): Promise<AgentUpdateResult>`
  - `agentsDelete(params: AgentDeleteParams): Promise<AgentDeleteResult>`
  - `agentsFilesList(agentId: string): Promise<AgentFilesListResult>`
  - `agentsFilesGet(agentId: string, name: string): Promise<AgentFileContent>`
  - `agentsFilesSet(agentId: string, name: string, content: string): Promise<AgentFileSetResult>`

#### Scenario: 所有方法均有 TypeScript 类型约束

- **WHEN** 调用 GatewayAdapter 的任何方法
- **THEN** 入参和返回值 SHALL 具有明确的 TypeScript 类型定义，不使用 `any` 或 `unknown` 作为方法级返回类型

## ADDED Requirements

### Requirement: Agent CRUD 类型定义

系统 SHALL 在 `adapter-types.ts` 中定义 Agent 管理所需的类型。

#### Scenario: AgentCreateParams 类型

- **WHEN** 调用 `agentsCreate()`
- **THEN** 入参类型 SHALL 包含：
  - `name: string`（必填）
  - `workspace: string`（必填）
  - `emoji?: string`（可选）
  - `avatar?: string`（可选）

#### Scenario: AgentUpdateParams 类型

- **WHEN** 调用 `agentsUpdate()`
- **THEN** 入参类型 SHALL 包含：
  - `agentId: string`（必填）
  - `name?: string`（可选）
  - `workspace?: string`（可选）
  - `model?: string | { primary?: string; fallbacks?: string[] }`（可选）
  - `avatar?: string`（可选）

#### Scenario: AgentDeleteParams 类型

- **WHEN** 调用 `agentsDelete()`
- **THEN** 入参类型 SHALL 包含：
  - `agentId: string`（必填）
  - `deleteFiles?: boolean`（可选，默认 false）

#### Scenario: AgentFilesListResult 类型

- **WHEN** 调用 `agentsFilesList()`
- **THEN** 返回类型 SHALL 包含：
  - `agentId: string`
  - `workspace: string`
  - `files: AgentFileInfo[]`（每项含 `name: string`、`size: number`、`modifiedAt: string`）

#### Scenario: AgentFileContent 类型

- **WHEN** 调用 `agentsFilesGet()`
- **THEN** 返回类型 SHALL 包含：
  - `agentId: string`
  - `workspace: string`
  - `file: { name: string; content: string; size: number; modifiedAt: string }`

### Requirement: WsAdapter Agent CRUD 实现

WsAdapter SHALL 实现所有新增的 Agent 管理方法。

#### Scenario: agentsCreate 调用映射

- **WHEN** 调用 WsAdapter 的 `agentsCreate(params)`
- **THEN** SHALL 内部调用 `rpcClient.request("agents.create", params)` 并返回类型化结果

#### Scenario: agentsUpdate 调用映射

- **WHEN** 调用 WsAdapter 的 `agentsUpdate(params)`
- **THEN** SHALL 内部调用 `rpcClient.request("agents.update", params)` 并返回类型化结果

#### Scenario: agentsDelete 调用映射

- **WHEN** 调用 WsAdapter 的 `agentsDelete(params)`
- **THEN** SHALL 内部调用 `rpcClient.request("agents.delete", params)` 并返回类型化结果

#### Scenario: agentsFilesList 调用映射

- **WHEN** 调用 WsAdapter 的 `agentsFilesList(agentId)`
- **THEN** SHALL 内部调用 `rpcClient.request("agents.files.list", { agentId })` 并返回类型化结果

#### Scenario: agentsFilesGet 调用映射

- **WHEN** 调用 WsAdapter 的 `agentsFilesGet(agentId, name)`
- **THEN** SHALL 内部调用 `rpcClient.request("agents.files.get", { agentId, name })` 并返回类型化结果

#### Scenario: agentsFilesSet 调用映射

- **WHEN** 调用 WsAdapter 的 `agentsFilesSet(agentId, name, content)`
- **THEN** SHALL 内部调用 `rpcClient.request("agents.files.set", { agentId, name, content })` 并返回类型化结果

### Requirement: MockAdapter Agent CRUD 实现

MockAdapter SHALL 实现所有新增的 Agent 管理方法，返回合理的模拟数据。

#### Scenario: MockAdapter agentsCreate 返回模拟结果

- **WHEN** 调用 MockAdapter 的 `agentsCreate()`
- **THEN** SHALL 返回包含 `{ ok: true, agentId, name, workspace }` 的模拟结果

#### Scenario: MockAdapter agentsFilesList 返回模拟文件列表

- **WHEN** 调用 MockAdapter 的 `agentsFilesList()`
- **THEN** SHALL 返回包含 SOUL.md、TOOLS.md、IDENTITY.md 等模拟文件的列表
