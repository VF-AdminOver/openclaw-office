## 1. Store 扩展（监控数据）

- [x] 1.1 在 `src/gateway/types.ts` 中新增 `TokenSnapshot` 类型
- [x] 1.2 在 `src/store/office-store.ts` 中新增状态字段：`tokenHistory`、`agentCosts`
- [x] 1.3 新增 `pushTokenSnapshot(snapshot)` action——追加到 tokenHistory，超过 30 条时移除最旧
- [x] 1.4 新增 `setAgentCosts(costs)` action
- [x] 1.5 更新 `src/gateway/types.ts` 的 OfficeStore 接口
- [x] 1.6 更新 store test resetStore 包含新字段

## 2. Usage 数据管线

- [x] 2.1 创建 `src/hooks/useUsagePoller.ts`——每 60 秒调用 RPC
- [x] 2.2 实现断线暂停/重连恢复逻辑
- [x] 2.3 实现 RPC 失败 fallback：连续 3 次失败后切换为本地聚合
- [x] 2.4 同时轮询 `usage.cost` RPC
- [x] 2.5 mock 数据通过 fallback 本地聚合实现
- [x] 2.6 在 `src/hooks/useGatewayConnection.ts` 中集成 useUsagePoller

## 3. Token 消耗折线图

- [x] 3.1 创建 `src/components/panels/TokenLineChart.tsx` 使用 Recharts LineChart
- [x] 3.2-3.7 X 轴 HH:mm、Y 轴自动缩放、总量实线、Top 5 虚线、Tooltip、空状态

## 4. 成本饼图

- [x] 4.1 创建 `src/components/panels/CostPieChart.tsx` 使用 Recharts PieChart
- [x] 4.2-4.5 颜色 generateAvatar3dColor、中心总成本、Tooltip、空状态

## 5. Agent 关系拓扑图

- [x] 5.1 创建 `src/components/panels/NetworkGraph.tsx` 纯 SVG
- [x] 5.2-5.7 圆形布局、节点大小/颜色映射、边线宽度、hover 高亮、空状态

## 6. 活跃度热力图

- [x] 6.1 创建 `src/components/panels/ActivityHeatmap.tsx` SVG rect 矩阵
- [x] 6.2-6.7 按 Agent×小时聚合、颜色映射、hover tooltip、空状态

## 7. MetricsPanel Tab 集成

- [x] 7.1 修改 MetricsPanel 添加 Tab 切换条（概览 | 趋势 | 拓扑 | 活跃）
- [x] 7.2 Tab state 管理
- [x] 7.3 各 Tab 对应渲染正确的图表组件
- [x] 7.4 按需渲染：仅挂载当前 Tab 组件
- [x] 7.5 验证 Tab 切换流畅

## 8. 测试与验证

- [x] 8.1 pnpm test 通过（22 files, 114 tests）
- [x] 8.2 pnpm typecheck 无类型错误
- [x] 8.3 pnpm check lint + format 通过
- [x] 8.4 浏览器验证 MetricsPanel Tab 切换正常，空状态文案正确显示
- [x] 8.5 图表组件在获取数据后可正常渲染（通过 usage poller fallback）
- [x] 8.6 Phase 2 功能无回归
