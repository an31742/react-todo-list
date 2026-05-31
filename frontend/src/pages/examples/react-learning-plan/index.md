# 📐 React 学习计划

> 从"会开发项目"到"真正理解复杂系统并具备 AI 应用工程能力"

---

## 📂 目录结构

```
react-learning-plan/
├── index.md                    ← 学习计划入口（当前文件）
├── learning-plan.md            ← 完整学习计划
├── full-blog.md                ← Day 1~6 完整博客
├── performance-report.md       ← TodoPage 性能优化报告
└── blogs/                      ← 每日博客输出
    ├── day01-render-flow.md
    ├── day02-hooks-chain.md
    ├── day03-useeffect.md
    ├── day04-useref.md
    └── day05-usememo-usecallback.md
```

---

## 📅 学习路线总览

| 阶段 | 模块 | 项目 | 进度 |
|------|------|------|------|
| **一、React 核心** | Render 流程 / Hooks / 性能优化 | `react-todo-list` | ✅ 完成 |
| **二、Next.js** | SSR / RSC / Streaming / AI Chat | `next_vite/next-api` | **▶ 进行中** |
| 三、Node.js + BFF | Event Loop / JWT / Redis / BFF | `next_vite/next-api` | ⏳ |
| 四、工程化 | Monorepo / CI / 构建工具 | `react-todo-list` | ⏳ |
| 五、AI 工程 | LangChain / RAG / Agent | 新建项目 | ⏳ |
| 六、AI 面试系统 | 完整 AI Web 应用 | 新建项目 | ⏳ |

---

## ✅ 已完成（React 核心）

| 天 | 主题 | 核心理解 | 产出 |
|----|------|---------|------|
| 1 | React Render 流程 | setState → 组件重执行 → 虚拟 DOM Diff → 提交 | [博客](blogs/day01-render-flow.md) |
| 2 | Hooks 链表 | hooks 按顺序存储在链表中，不能写 if/for | [博客](blogs/day02-hooks-chain.md) |
| 3 | useEffect 与 cleanup | 死循环成因、闭包陷阱、清理时机 | [博客](blogs/day03-useeffect.md) |
| 4 | useRef | 跨渲染保持引用，修改不触发渲染 | [博客](blogs/day04-useref.md) |
| 5 | useMemo / useCallback / memo | 三者分工：缓存计算 / 稳定引用 / 跳过渲染 | [博客](blogs/day05-usememo-usecallback.md) |
| 6 | Profiler 实战 | 录制火焰图 → 定位问题 → 优化 → 对比验证 | [优化报告](performance-report.md) |

### 📌 核心认知（必须记住）

```
useMemo    → 缓存计算结果（跳过的是计算，不是渲染）
useCallback → 稳定函数引用（必须配合 React.memo）
React.memo → 浅比较 props → 跳过子组件渲染
```

---

## ▶ 下一阶段：Next.js 服务端体系

**项目：** `next_vite/next-api`

| 周 | 主题 | 关键内容 |
|----|------|---------|
| 第 1 周 | SSR / RSC / Hydration | SSR 流程、水合错误、Server/Client Component 边界、App Router、Server Actions、缓存策略 |
| 第 2 周 | Streaming + AI Chat | SSE 原理、Next 流式输出、打字机效果、Markdown 渲染、完整 AI 聊天 demo |

### 学习方式变更

之前 React 学习是在 `react-todo-list` 里写 Demo + 在 VSCode 本地做实验。
接下来 Next.js 直接在 `next_vite/next-api` 项目里动手，每个概念在真实项目里验证。

---

## 🔗 相关资源

- [完整学习计划](learning-plan.md)
- [Day 1~6 完整博客](blogs/full-blog.md)
- [VuePress 博客入口](../../../../vuepress_blog/src/businessProblem/React学习笔记/README.md)
