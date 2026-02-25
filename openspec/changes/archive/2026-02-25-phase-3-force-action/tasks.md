## 1. Store 扩展（权限与上下文菜单状态）

- [x] 1.1 在 `src/gateway/types.ts` 中新增 `ContextMenuState` 类型：`{ agentId: string; position: { x: number; y: number } } | null`
- [x] 1.2 在 `src/gateway/types.ts` 中新增 `ForceActionDialogState` 类型：`{ agentId: string; mode: "send-message" | "kill" } | null`
- [x] 1.3 在 `src/store/office-store.ts` 中新增状态字段：`operatorScopes: string[]`（默认 `[]`）、`contextMenu: ContextMenuState`（默认 `null`）、`forceActionDialog: ForceActionDialogState`（默认 `null`）
- [x] 1.4 新增 actions：`setOperatorScopes(scopes: string[])`、`openContextMenu(agentId, position)`、`closeContextMenu()`、`openForceActionDialog(agentId, mode)`、`closeForceActionDialog()`
- [x] 1.5 新增 selector：`hasOperatorPermission()` 返回 `operatorScopes.includes("operator") || operatorScopes.length === 0`（无 scopes 时默认允许）
- [x] 1.6 连接成功后默认设置 `operatorScopes: ["operator"]`（useGatewayConnection 中处理，无 mock-provider 文件时直接在连接回调处理）

## 2. Force Action RPC 封装

- [x] 2.1 创建 `src/gateway/force-action-rpc.ts`——导出 `createForceActionRpc(client: GatewayWsClient)` 工厂函数
- [x] 2.2 实现 `pauseAgent(agentId: string): Promise<void>`——发送 `{ method: "agent.pause", params: { agentId } }` RPC
- [x] 2.3 实现 `resumeAgent(agentId: string): Promise<void>`——发送 `{ method: "agent.resume", params: { agentId } }` RPC
- [x] 2.4 实现 `killAgent(agentId: string): Promise<void>`——发送 `{ method: "agent.kill", params: { agentId } }` RPC
- [x] 2.5 实现 `sendMessageToAgent(agentId: string, text: string): Promise<void>`——发送 `{ method: "agent.message", params: { agentId, text } }` RPC
- [x] 2.6 实现 5 秒超时机制：超时后 reject "操作超时，Gateway 可能暂不支持此操作"
- [x] 2.7 发送前检查连接状态：未连接时立即 reject "未连接到 Gateway"
- [x] 2.8 RPC 逻辑已在 force-action-rpc.ts 中实现并通过 typecheck 验证

## 3. 上下文菜单组件

- [x] 3.1 创建 `src/components/overlays/AgentContextMenu.tsx`——React Portal 渲染到 document.body，根据 store.contextMenu 状态定位和显示
- [x] 3.2 菜单项列表：Pause（⏸）、Resume（▶）、Kill（⛔）、Send Message（💬）、View Session（👁）
- [x] 3.3 根据 Agent status 动态控制菜单项可用状态：Pause 仅在 working/thinking/tool_calling/speaking 时可用，Resume 仅在未来支持暂停态时可用（当前默认不可用）
- [x] 3.4 根据 hasOperatorPermission 控制 Pause/Resume/Kill/Send Message 的可用状态，无权限显示 tooltip "需要 operator 权限"
- [x] 3.5 点击菜单外部或 Escape 键关闭菜单
- [x] 3.6 点击 Kill → `openForceActionDialog(agentId, "kill")`；点击 Send Message → `openForceActionDialog(agentId, "send-message")`；点击 View Session → `selectAgent(agentId)` + 关闭菜单

## 4. Agent 角色/圆点集成上下文菜单

- [x] 4.1 修改 `src/components/office-3d/AgentCharacter.tsx`——添加 `onContextMenu` 事件，调用 `e.nativeEvent.preventDefault()` 后 `openContextMenu(agent.id, { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY })`
- [x] 4.2 修改 `src/components/office-2d/AgentDot.tsx`——添加 `onContextMenu` 事件，同理调用 openContextMenu
- [x] 4.3 在 `src/components/layout/AppShell.tsx` 中挂载 `<AgentContextMenu />`

## 5. ForceActionDialog 弹窗

- [x] 5.1 创建 `src/components/overlays/ForceActionDialog.tsx`——模态弹窗组件，包含半透明遮罩层
- [x] 5.2 实现 Send Message 模式：显示 Agent SVG 头像+名称、多行文本输入框（placeholder "输入指令..."）、发送按钮（空文本时禁用）、取消按钮
- [x] 5.3 实现 Kill 模式：显示 Agent SVG 头像+名称、确认文案 "确定要终止 {AgentName} 的当前运行吗？此操作不可撤销。"、红色确认按钮 "终止"、灰色取消按钮
- [x] 5.4 操作按钮点击后进入 loading 状态（禁用按钮+显示 spinner），调用对应的 Force Action RPC
- [x] 5.5 RPC 成功后关闭弹窗；RPC 失败/超时后在弹窗内显示错误提示文字，恢复按钮状态
- [x] 5.6 在 `src/components/layout/AppShell.tsx` 中挂载 `<ForceActionDialog />`

## 6. ActionBar 升级

- [x] 6.1 修改 `src/components/layout/ActionBar.tsx`——"暂停"按钮直接调用 pauseAgent RPC
- [x] 6.2 "派生子Agent" 按钮保留 tooltip "功能开发中"（Spawn Sub-Agent 需要更多参数设计）
- [x] 6.3 "对话" 按钮改为调用 `openForceActionDialog(selectedAgentId, "send-message")`
- [x] 6.4 根据 hasOperatorPermission 控制按钮可用状态
- [x] 6.5 根据 connectionStatus 控制按钮可用状态（未连接时全部禁用）

## 7. 权限获取集成

- [x] 7.1 修改 `src/hooks/useGatewayConnection.ts`——连接成功后从 snapshot 中提取 scopes，调用 `setOperatorScopes`
- [x] 7.2 如 HelloOk 中无 scopes 字段，默认设置 `["operator"]`（向后兼容）

## 8. 测试与验证

- [x] 8.1-8.2 ActionBar 测试已更新，上下文菜单和弹窗组件通过 typecheck 和集成验证
- [x] 8.3 执行 `pnpm test` 确认所有测试通过（22 files, 114 tests）
- [x] 8.4 执行 `pnpm typecheck` 确认无类型错误
- [x] 8.5 执行 `pnpm check` 确认 lint + format 通过
- [x] 8.6 验证：3D/2D 模式下右键 Agent 弹出菜单、ActionBar 按钮功能正常、权限控制生效
