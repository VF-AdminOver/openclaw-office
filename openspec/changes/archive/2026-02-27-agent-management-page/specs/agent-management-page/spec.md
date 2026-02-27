## ADDED Requirements

### Requirement: Agent 管理页面入口

系统 SHALL 在 Console 控制台中提供 `/agents` 路由，渲染 Agent 管理页面。页面 SHALL 在 ConsoleLayout 内渲染，使用与其他控制台页面一致的布局结构。

#### Scenario: 通过 URL 直接访问 Agent 管理页面

- **WHEN** 用户通过 URL hash 访问 `/#/agents`
- **THEN** 系统 SHALL 渲染 Agent 管理页面
- **AND** 页面 SHALL 在 ConsoleLayout 的内容区域内展示

#### Scenario: 通过侧边栏导航进入

- **WHEN** 用户在 Console 侧边栏中点击 "Agents" 导航项
- **THEN** 系统 SHALL 导航到 `/agents` 路由
- **AND** "Agents" 导航项 SHALL 高亮显示

### Requirement: Agent 列表面板

页面 SHALL 在左侧展示 Agent 列表面板（固定宽度 `w-72`），显示所有已配置的 Agent。

#### Scenario: 加载并展示 Agent 列表

- **WHEN** Agent 管理页面首次加载
- **THEN** 系统 SHALL 调用 `agentsList()` 获取所有 Agent
- **AND** 列表顶部 SHALL 显示 "Agents" 标题和已配置 Agent 数量（如 "4 configured."）
- **AND** 列表顶部 SHALL 提供 "Refresh" 按钮用于刷新列表

#### Scenario: Agent 列表项展示

- **WHEN** Agent 列表数据加载完成
- **THEN** 每个 Agent 列表项 SHALL 展示：
  - Agent 的 emoji 或头像（取自 `identity.emoji` 或 `identity.avatarUrl`）
  - Agent 名称（取自 `identity.name` 或 `name` 或 `id`）
  - Agent 的 ID（作为副标题显示）
  - 若为 default Agent，SHALL 显示 "DEFAULT" 徽章

#### Scenario: 选中 Agent

- **WHEN** 用户点击某个 Agent 列表项
- **THEN** 该列表项 SHALL 高亮显示（左侧边框 + 背景色变化）
- **AND** 右侧详情区域 SHALL 展示该 Agent 的详情

#### Scenario: Agent 列表搜索过滤

- **WHEN** 用户在列表顶部的搜索框中输入文字
- **THEN** Agent 列表 SHALL 按名称和 ID 进行模糊过滤，只显示匹配的 Agent

### Requirement: Agent 详情头部

选中 Agent 后，右侧详情区域顶部 SHALL 展示 Agent 的概览信息。

#### Scenario: 展示 Agent 头部信息

- **WHEN** 选中某个 Agent
- **THEN** 详情头部 SHALL 展示：
  - Agent 的 emoji 或头像（大尺寸）
  - Agent 名称
  - Agent 描述信息（"Agent workspace and routing."）
  - Agent ID（右上角）
  - 若为 default Agent，SHALL 显示 "DEFAULT" 徽章

### Requirement: Agent 详情 Tab 导航

详情区域 SHALL 在头部下方提供 Tab 导航，包含 6 个 Tab。

#### Scenario: Tab 列表和默认选中

- **WHEN** 选中某个 Agent
- **THEN** 系统 SHALL 展示以下 Tab：Overview、Files、Tools、Skills、Channels、Cron Jobs
- **AND** 默认选中 "Overview" Tab

#### Scenario: Tab 切换

- **WHEN** 用户点击某个 Tab
- **THEN** 选中 Tab SHALL 高亮显示
- **AND** Tab 下方内容区域 SHALL 切换为对应 Tab 的内容

### Requirement: Overview Tab

Overview Tab SHALL 展示 Agent 的基本配置信息和模型配置。

#### Scenario: 展示 Agent 基本信息

- **WHEN** Overview Tab 处于活跃状态
- **THEN** SHALL 展示以下信息：
  - Agent ID
  - Agent 名称
  - Workspace 路径
  - 是否为 default Agent

#### Scenario: 展示模型配置

- **WHEN** Overview Tab 处于活跃状态
- **THEN** SHALL 在模型配置区域展示：
  - Primary Model（当前主模型，如 "anthropic/claude-sonnet-4"）
  - Fallback Models（备选模型列表）

#### Scenario: 编辑模型配置

- **WHEN** 用户修改 Primary Model 输入框的值并点击 Save
- **THEN** 系统 SHALL 调用 `agentsUpdate()` 更新 Agent 的模型配置
- **AND** 成功后 SHALL 展示成功提示

### Requirement: Files Tab

Files Tab SHALL 展示和编辑 Agent 的核心工作空间文件。

#### Scenario: 加载文件列表

- **WHEN** Files Tab 处于活跃状态
- **THEN** 系统 SHALL 调用 `agentsFilesList()` 获取该 Agent 的文件列表
- **AND** 展示 "Core Files" 标题、workspace 路径、"Refresh" 按钮
- **AND** 左侧以卡片形式展示文件列表（文件名 + 文件大小 + 最后修改时间）

#### Scenario: 选中文件查看内容

- **WHEN** 用户点击某个文件卡片
- **THEN** 该卡片 SHALL 高亮显示
- **AND** 右侧 SHALL 展示文件编辑区域，包含：
  - 文件名标题
  - 文件路径副标题
  - "Reset" 和 "Save" 按钮
  - "Content" 标签下方的 textarea 显示文件内容

#### Scenario: 编辑并保存文件

- **WHEN** 用户修改 textarea 中的文件内容并点击 "Save"
- **THEN** 系统 SHALL 调用 `agentsFilesSet()` 保存文件内容
- **AND** 成功后 SHALL 展示保存成功提示

#### Scenario: 重置文件内容

- **WHEN** 用户修改了文件内容后点击 "Reset"
- **THEN** textarea SHALL 恢复为最后一次从服务端加载的原始内容

### Requirement: Tools Tab

Tools Tab SHALL 展示 Agent 的工具策略配置。

#### Scenario: 展示工具配置

- **WHEN** Tools Tab 处于活跃状态
- **THEN** SHALL 展示 Agent 的工具策略信息（只读）：
  - 工具 Profile（如 "coding"、"default"）
  - Allow 列表（允许的工具）
  - Deny 列表（禁止的工具）

### Requirement: Skills Tab

Skills Tab SHALL 展示 Agent 绑定的技能列表。

#### Scenario: 展示技能列表

- **WHEN** Skills Tab 处于活跃状态
- **THEN** SHALL 展示 Agent 的 `skills` 配置数组
- **AND** 若 skills 为空数组，显示 "无技能限制（使用所有已启用技能）"
- **AND** 若 skills 未配置，显示 "使用默认技能配置"

### Requirement: Channels Tab

Channels Tab SHALL 展示 Agent 关联的频道路由信息。

#### Scenario: 展示频道路由

- **WHEN** Channels Tab 处于活跃状态
- **THEN** SHALL 展示与该 Agent 关联的频道绑定信息（只读）
- **AND** 若无绑定，显示 "该 Agent 未绑定任何频道"

### Requirement: Cron Jobs Tab

Cron Jobs Tab SHALL 展示 Agent 关联的定时任务。

#### Scenario: 展示定时任务

- **WHEN** Cron Jobs Tab 处于活跃状态
- **THEN** SHALL 展示与该 Agent 关联的定时任务列表（只读）
- **AND** 若无定时任务，显示 "该 Agent 无定时任务"

### Requirement: 添加新 Agent

系统 SHALL 提供添加新 Agent 的功能。

#### Scenario: 打开新建 Agent Dialog

- **WHEN** 用户点击 Agent 列表上方的 "添加 Agent" 按钮
- **THEN** 系统 SHALL 弹出新建 Agent 的 Dialog 表单

#### Scenario: 新建 Agent 表单字段

- **WHEN** 新建 Agent Dialog 打开
- **THEN** 表单 SHALL 包含以下字段：
  - Agent 名称（必填，文本输入框）
  - Workspace 路径（必填，文本输入框，默认值为 `~/.openclaw/workspace-<name>`）
  - Emoji（可选，emoji 输入框）

#### Scenario: 提交创建 Agent

- **WHEN** 用户填写完表单并点击 "创建"
- **THEN** 系统 SHALL 调用 `agentsCreate()` 创建 Agent
- **AND** 成功后 SHALL 关闭 Dialog、刷新 Agent 列表、自动选中新创建的 Agent

#### Scenario: 创建失败处理

- **WHEN** `agentsCreate()` 返回错误
- **THEN** 系统 SHALL 在 Dialog 内展示错误信息，不关闭 Dialog

### Requirement: 删除 Agent

系统 SHALL 允许删除非 default 的 Agent。

#### Scenario: 触发删除操作

- **WHEN** 用户在 Overview Tab 或 Agent 列表项中点击 "删除" 按钮
- **THEN** 系统 SHALL 弹出 ConfirmDialog 确认删除

#### Scenario: 确认删除 Dialog

- **WHEN** 删除确认 Dialog 弹出
- **THEN** Dialog SHALL 包含：
  - 警告文案（"确认要删除 Agent [name] 吗？此操作不可逆。"）
  - 可选复选框 "同时删除工作空间文件"（默认不勾选）
  - "取消" 和 "删除" 按钮

#### Scenario: 执行删除

- **WHEN** 用户确认删除
- **THEN** 系统 SHALL 调用 `agentsDelete()` 并传入 `deleteFiles` 参数
- **AND** 成功后 SHALL 刷新列表并清除选中状态

#### Scenario: 不允许删除 default Agent

- **WHEN** 当前选中的 Agent 为 default Agent
- **THEN** 删除按钮 SHALL 被禁用，并提示 "无法删除默认 Agent"

### Requirement: agents-store 状态管理

系统 SHALL 使用 Zustand Store 管理 Agent 管理页面的所有状态。

#### Scenario: Store 状态结构

- **WHEN** agents-store 初始化
- **THEN** Store SHALL 包含以下状态：
  - `agents: AgentListItem[]` — Agent 列表
  - `selectedAgentId: string | null` — 选中 Agent
  - `activeTab: AgentTab` — 当前 Tab
  - `isLoading: boolean` — 列表加载状态
  - `error: string | null` — 错误信息
  - `searchQuery: string` — 搜索关键字
  - `files: AgentFile[]` — 当前 Agent 的文件列表
  - `selectedFileName: string | null` — 选中的文件名
  - `fileContent: string | null` — 选中文件内容
  - `isFileDirty: boolean` — 文件是否已修改
  - `createDialogOpen: boolean` — 创建 Dialog 状态
  - `deleteDialogOpen: boolean` — 删除 Dialog 状态
  - `defaultAgentId: string` — 默认 Agent ID

#### Scenario: 异步数据获取

- **WHEN** 调用 `fetchAgents()` action
- **THEN** Store SHALL 设置 `isLoading: true`，调用 adapter 获取数据，完成后更新 `agents` 并设置 `isLoading: false`
- **AND** 若出错 SHALL 设置 `error` 字段
