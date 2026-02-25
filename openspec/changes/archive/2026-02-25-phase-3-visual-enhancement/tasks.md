## 1. Store 扩展（主题与 Bloom 状态）

- [x] 1.1 在 `src/store/office-store.ts` 中新增 `theme: "light" | "dark"` 状态字段，默认值从 `localStorage.getItem("openclaw-theme")` 读取，无值时默认 "dark"
- [x] 1.2 新增 `setTheme(theme: "light" | "dark")` action，切换时同步写入 localStorage
- [x] 1.3 新增 `bloomEnabled: boolean` 状态字段，默认 `true`（当 `devicePixelRatio < 1.5` 时默认 `false`）
- [x] 1.4 新增 `setBloomEnabled(enabled: boolean)` action
- [x] 1.5 在 `src/gateway/types.ts` 的 OfficeStore 接口中添加对应类型声明
- [x] 1.6 更新 `src/store/__tests__/office-store.test.ts`，测试 theme 初始值、切换、localStorage 持久化和 bloomEnabled 状态

## 2. 日/夜主题切换

- [x] 2.1 修改 `src/components/office-3d/Environment3D.tsx`——接收 theme prop，定义两套灯光参数（light: directional 1.2 暖色 + ambient 0.65; dark: directional 0.4 冷色 + ambient 0.2 + 2-3 个 PointLight 模拟台灯暖光），使用 useFrame + lerp 实现 500ms 平滑过渡
- [x] 2.2 修改 `src/components/office-3d/Scene3D.tsx`——Canvas 背景色根据 theme 切换（light=#e8ecf2, dark=#0f1729），使用 `gl.setClearColor` 平滑过渡
- [x] 2.3 在 `src/App.tsx` 根组件中根据 `store.theme` 设置 `<html>` 元素的 `data-theme` 属性，联动 Tailwind dark mode
- [x] 2.4 修改 `src/components/layout/TopBar.tsx`——在视图切换按钮旁新增主题切换按钮（日间显示 ☀️/太阳图标，夜间显示 🌙/月亮图标），点击调用 `setTheme`
- [x] 2.5 验证：切换主题后 3D 灯光平滑过渡、UI 配色同步变化、刷新页面保持主题选择

## 3. Bloom 后处理特效

- [x] 3.1 安装依赖：`pnpm add @react-three/postprocessing`
- [x] 3.2 修改 `src/components/office-3d/Scene3D.tsx`——在 Canvas 内添加 `<EffectComposer>` + `<Bloom intensity={1.2} luminanceThreshold={0.6} luminanceSmoothing={0.4} />`，仅当 `bloomEnabled` 为 true 时渲染
- [x] 3.3 ParentChildLine 使用 drei `<Line>` (LineMaterial)，不支持 emissive 属性；Bloom 通过 luminanceThreshold 自动对明亮线条生效
- [x] 3.4 修改 `src/components/office-3d/ThinkingIndicator.tsx`——TorusGeometry 材质增加 `emissiveIntensity={2}`
- [x] 3.5 修改 `src/components/office-3d/ErrorIndicator.tsx`——OctahedronGeometry 材质增加 `emissiveIntensity={2}`
- [x] 3.6 验证：3D 模式下协作连线和状态指示器有柔和发光效果，关闭 bloomEnabled 后发光消失，2D 模式无后处理开销

## 4. SkillHologram 全息工具面板

- [x] 4.1 创建 `src/components/office-3d/SkillHologram.tsx`——接收 `tool: { name: string }` 和 `position: [number, number, number]` props
- [x] 4.2 实现全息面板外观：PlaneGeometry(0.6, 0.4) 半透明蓝色材质(opacity=0.15, emissive=#3b82f6, emissiveIntensity=0.3)，面板始终面向相机
- [x] 4.3 使用 drei `<Html>` 在面板上渲染：工具图标（通过工具名映射 Emoji）、工具名称文本、CSS 条纹进度条动画(indeterminate)
- [x] 4.4 实现弹出动画：scale 0→1（easeOutBack 缓动，300ms）
- [x] 4.5 在 `src/components/office-3d/AgentCharacter.tsx` 中集成：tool_calling 状态时渲染 SkillHologram 替代现有 ToolScreen，位置偏移 Agent 正前方 45° + Y+0.5
- [x] 4.6 保留 ToolScreen.tsx 用于 2D 模式（如有引用），确保 2D 模式不受影响
- [x] 4.7 验证：Agent 调用工具时全息面板弹出显示工具信息和进度，工具完成时消失

## 5. SVG 生成式头像

- [x] 5.1 在 `src/lib/avatar-generator.ts` 中新增 `SvgAvatarData` 类型（faceShape, hairStyle, skinColor, hairColor, shirtColor, eyeStyle）和 `generateSvgAvatar(agentId: string): SvgAvatarData` 函数
- [x] 5.2 实现基于 hash 不同 bit 段的确定性部件选择：脸型 3 种（圆/方/椭圆）、发型 5 种、肤色 6 种、发色 4 种、衣服颜色使用现有 PALETTE
- [x] 5.3 创建 `src/components/shared/SvgAvatar.tsx` React 组件——接收 agentId 和 size 属性，渲染 SVG 头像（脸型轮廓 + 发型路径 + 眼睛 + 衣服区域 + 颜色填充）
- [x] 5.4 修改 `src/components/layout/Sidebar.tsx`——Agent 列表中使用 `<SvgAvatar>` 替代现有 Avatar 圆形
- [x] 5.5 修改 `src/components/panels/AgentDetailPanel.tsx`——详情面板头部使用较大尺寸的 `<SvgAvatar>`
- [x] 5.6 创建 `src/lib/__tests__/svg-avatar-generator.test.ts`——测试确定性（同 agentId 结果一致）、多样性（20 个不同 ID 至少 3 种脸型 + 4 种发型）、颜色一致性（shirtColor 与 generateAvatar3dColor 结果一致）
- [x] 5.7 验证：Sidebar 和 AgentDetailPanel 显示各不相同的 SVG 头像，颜色与 3D 角色身体颜色一致

## 6. 集成测试与端到端验证

- [x] 6.1 执行 `pnpm test` 确认所有新增和既有测试通过（22 files, 114 tests）
- [x] 6.2 执行 `pnpm typecheck` 确认无类型错误
- [x] 6.3 执行 `pnpm check` 确认 lint + format 通过
- [x] 6.4 启动 `pnpm dev`，验证 3D 模式下 Bloom 效果、主题切换、全息面板、SVG 头像均正常工作
- [x] 6.5 验证 2D 模式不受影响：切换到 2D → Agent 状态展示正常、无 3D 相关错误
- [x] 6.6 验证 Phase 2 功能无回归：Agent 角色渲染、侧栏列表、详情面板均正常
