# TorchCode Frontend Redesign — Apple 简约风

## Context

TorchCode 是一个 "LeetCode for PyTorch" 编程练习平台。现有前端由 minimax 生成，整体质量不满意，需要完全推倒重写。目标是实现 LeetCode 功能 + Apple 简约视觉风格的前端。

## 技术栈

保留现有 Next.js 14 技术栈：
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS 3.4
- Monaco Editor (浅色主题)
- Zustand 状态管理
- better-sqlite3 服务端持久化
- Radix UI 原语 + CVA + lucide-react
- 后端 API 路由全部复用，不改动

## 设计方向：选择性毛玻璃

核心原则：
- 只在顶部导航栏和刷题页操作栏使用 `backdrop-blur` 毛玻璃
- 其余区域用干净白底 (`#ffffff` / `#fafafa`) + 细边框 (`border-gray-200`) + 微阴影 (`shadow-sm`)
- Inter 字体，`tracking-tight` 标题，充足留白
- 主色调：中性灰 + Apple 蓝 (`#007aff`) 作为交互色
- 难度标签：柔和药丸形 — 绿(Easy)、琥珀(Medium)、玫红(Hard)
- 状态指示：实心圆(solved)、空心圆(todo)、半填充时钟图标(attempted)
- 过渡动画：200-300ms ease-out，hover/展开/收起

## 页面设计

### 1. 首页 `/`

- 顶部毛玻璃导航栏（logo + 导航链接 + 进度统计）
- Hero 区域：大标题 + 副标题 + CTA 按钮，简洁有力
- 下方展示题目统计（按难度分布）+ "开始刷题" 入口按钮
- 内容区 `max-w-5xl` 居中

### 2. 题目列表页 `/problems`

- 顶部搜索栏 + 难度/状态筛选器
- 表格式题目列表，每行：状态图标、题号、标题、难度药丸
- hover 行高亮，点击进入刷题页
- 内容区 `max-w-4xl` 居中

### 3. 刷题详情页 `/problems/[id]`

- 全屏布局，无 `max-w` 限制
- 可拖拽左右分栏（自定义 hook，~40行，无需第三方库）
  - 左栏：题目描述 + Radix Tabs 切换（描述 | 题解）
    - 描述 tab：标题、难度、题目说明、示例、可展开提示
    - 题解 tab：参考解法代码（复用 CodeEditor 只读模式），与独立题解页 `/solutions/[id]` 不同，这里只展示代码，不含步骤说明
  - 右栏：Monaco 编辑器（浅色主题）+ 底部可折叠测试结果面板
- 底部毛玻璃操作栏：Run / Submit 按钮
- 左上角汉堡图标触发抽屉式题目导航侧边栏（不常驻，节省空间）

### 4. 题解页 `/solutions/[id]`

- 左右两栏网格：左侧只读代码编辑器，右侧 markdown 解析的步骤说明
- 顶部面包屑导航回到题目

## 组件架构

```
src/
  components/
    ui/
      GlassBar.tsx       — 毛玻璃容器 (backdrop-blur-lg bg-white/80)
      Badge.tsx           — 药丸标签 (CVA variants: difficulty, status)
      Button.tsx          — 按钮 (CVA variants: primary/secondary/ghost)
      SplitPane.tsx       — 可拖拽分栏 (自定义 mousedown/mousemove hook)
    layout/
      TopNav.tsx          — 顶部导航栏 (基于 GlassBar)
      ProblemDrawer.tsx   — 抽屉式题目侧边栏
    problem/
      ProblemRow.tsx      — 列表单行
      ProblemFilters.tsx  — 搜索 + 筛选
      DifficultyBadge.tsx — 难度药丸 (基于 Badge 组件的便捷封装)
      StatusIcon.tsx      — 状态图标
    workspace/
      DescriptionTab.tsx  — 题目描述面板
      SolutionTab.tsx     — 内嵌题解面板
      CodeEditor.tsx      — Monaco 浅色主题封装
      TestResults.tsx     — 可折叠测试结果
      ActionBar.tsx       — 底部操作栏 (基于 GlassBar)
    solution/
      SolutionPage.tsx    — 完整题解页面
```

## 设计 Tokens (tailwind.config.ts)

```
colors:
  accent: '#007aff'        — Apple 蓝，主交互色
  accent-hover: '#0062cc'
  surface: '#ffffff'        — 主背景
  surface-secondary: '#fafafa' — 次级背景
  border: '#e5e5e5'
  text-primary: '#1d1d1f'
  text-secondary: '#6e6e73'
  text-tertiary: '#aeaeb2'
  easy: '#34c759'
  medium: '#ff9500'
  hard: '#ff3b30'
  solved: '#30b0c7'

borderRadius:
  pill: '9999px'

shadow:
  soft: '0 1px 3px rgba(0,0,0,0.06)'
```

## Monaco 浅色主题

基于 `vs` 主题覆盖：
- 编辑器背景: `#fafafa`
- 前景色: `#1d1d1f`
- 关键字: `#af52de` (紫)
- 字符串: `#34c759` (绿)
- 注释: `#aeaeb2` (灰)
- 函数: `#007aff` (蓝)
- 行号: `#c7c7cc`

## 复用的现有代码

以下文件保持不变或仅做微调：
- `src/lib/types.ts` — 数据类型定义
- `src/lib/db.ts` — SQLite 数据层
- `src/lib/constants.ts` — 配置常量
- `src/lib/utils.ts` — cn() 工具函数
- `src/lib/parseNotebook.ts` — Jupyter 解析
- `src/lib/problems.json` — 题目数据
- `src/lib/starters.json` — 起始代码
- `src/store/problemStore.ts` — Zustand store
- `src/app/api/**` — 所有 API 路由

## 验证方式

1. `npm run build` 确保无编译错误
2. `npm run dev` 启动开发服务器，手动验证：
   - 首页渲染正常，导航栏毛玻璃效果可见
   - 题目列表页搜索/筛选功能正常
   - 刷题页分栏可拖拽，Monaco 编辑器加载浅色主题
   - 提交代码后测试结果正确显示
   - 题解页代码和说明正常渲染
3. 检查响应式布局在不同窗口宽度下的表现
