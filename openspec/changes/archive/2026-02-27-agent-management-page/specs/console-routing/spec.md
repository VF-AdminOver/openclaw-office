## MODIFIED Requirements

### Requirement: 路由定义结构

系统 SHALL 定义以下路由层级，使用 layout route 区分 Office 布局与管控页面布局。

#### Scenario: Office 路由使用 AppShell 布局

- **WHEN** 当前路由为 `/`
- **THEN** 系统 SHALL 使用现有 `AppShell` 组件作为布局容器，渲染 `OfficeView`（含 TopBar、右侧 Sidebar、ActionBar）

#### Scenario: 管控页面路由使用 ConsoleLayout 布局

- **WHEN** 当前路由为 `/dashboard`、`/channels`、`/skills`、`/cron`、`/settings` 或 `/agents`
- **THEN** 系统 SHALL 使用 `ConsoleLayout` 组件作为布局容器，渲染 TopBar + 内容区域（无 Office 右侧 Sidebar）

### Requirement: ConsoleLayout 左侧边栏导航

控制台页面 SHALL 使用左侧边栏导航来切换子功能页面，而非 TopBar 下拉菜单。

#### Scenario: 左侧边栏导航项

- **WHEN** 用户进入任何管控页面
- **THEN** ConsoleLayout SHALL 在左侧展示固定宽度的侧边栏（宽度 `w-52`），包含以下导航项（每项带图标）：
  - Dashboard（`Home` 图标）
  - Agents（`Bot` 图标）
  - Channels（`Radio` 图标）
  - Skills（`Puzzle` 图标）
  - Cron Tasks（`Clock` 图标）
  - Settings（`Settings` 图标）

#### Scenario: 侧边栏导航项高亮

- **WHEN** 当前路由匹配某个管控页面路径
- **THEN** 对应的侧边栏导航项 SHALL 显示为高亮/选中状态（蓝色背景 + 蓝色文字）

#### Scenario: 侧边栏导航项切换

- **WHEN** 用户点击侧边栏中的某个导航项
- **THEN** 系统 SHALL 导航到对应的管控页面路由，右侧内容区 SHALL 更新为对应页面组件

## ADDED Requirements

### Requirement: Agents 页面路由

系统 SHALL 新增 `/agents` 路由，在 ConsoleLayout 内渲染 Agent 管理页面。

#### Scenario: Agents 路由注册

- **WHEN** `App.tsx` 路由配置加载
- **THEN** SHALL 在 ConsoleLayout 子路由中包含 `<Route path="/agents" element={<AgentsPage />} />`

#### Scenario: PAGE_MAP 扩展

- **WHEN** 路由匹配到 `/agents`
- **THEN** `PAGE_MAP` SHALL 包含 `"/agents": "agents"` 映射
- **AND** `PageId` 类型 SHALL 包含 `"agents"` 值

#### Scenario: TopBar 页面标题

- **WHEN** 当前路由为 `/agents`
- **THEN** TopBar SHALL 展示 "Agents" 页面标题
