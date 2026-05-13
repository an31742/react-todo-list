import fs from 'node:fs'
import path from 'node:path'
import PPTXGenJS from 'pptxgenjs'

const outDir = path.resolve('deliverables')
fs.mkdirSync(outDir, { recursive: true })

const pptx = new PPTXGenJS()
pptx.layout = 'LAYOUT_WIDE'
pptx.author = 'Codex'
pptx.company = 'OpenAI'
pptx.subject = 'Interview deck for React full-stack admin project'
pptx.title = 'React 全栈管理后台 / 运营驾驶舱'
pptx.lang = 'zh-CN'
pptx.theme = {
  headFontFace: 'Microsoft YaHei',
  bodyFontFace: 'Microsoft YaHei',
  lang: 'zh-CN',
}

const C = {
  bg: '071122',
  panel: '0F1B31',
  panel2: '14213D',
  line: '2B4B7A',
  accent: '4DA3FF',
  accent2: '7DD3FC',
  text: 'F8FAFC',
  muted: 'C7D2FE',
  green: '34D399',
  yellow: 'FBBF24',
}

const W = 13.333
const H = 7.5

function addBg(slide) {
  slide.background = { color: C.bg }
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: H,
    line: { color: C.bg, transparency: 100 },
    fill: { color: C.bg },
  })
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -0.6, y: -0.5, w: 3.1, h: 3.1,
    line: { color: C.accent, transparency: 88 },
    fill: { color: C.accent, transparency: 90 },
  })
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10.4, y: 5.8, w: 3.2, h: 3.2,
    line: { color: C.accent2, transparency: 90 },
    fill: { color: C.accent2, transparency: 93 },
  })
}

function addFooter(slide, idx) {
  slide.addText(`React 全栈管理后台 / 面试材料`, {
    x: 0.45, y: 7.08, w: 4.4, h: 0.18,
    fontFace: 'Microsoft YaHei', fontSize: 8.5, color: '89A8D8', margin: 0,
  })
  slide.addText(String(idx).padStart(2, '0'), {
    x: 12.55, y: 7.02, w: 0.4, h: 0.22,
    align: 'right', fontFace: 'Microsoft YaHei', fontSize: 10, color: '89A8D8', margin: 0,
  })
}

function addTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.6, y: 0.45, w: 8.7, h: 0.55,
    fontFace: 'Microsoft YaHei', fontSize: 24, bold: true, color: C.text, margin: 0,
  })
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.62, y: 0.95, w: 9.4, h: 0.34,
      fontFace: 'Microsoft YaHei', fontSize: 10.5, color: C.muted, margin: 0,
    })
  }
  slide.addShape(pptx.ShapeType.line, {
    x: 0.62, y: 1.35, w: 12.0, h: 0,
    line: { color: C.line, pt: 1.2, transparency: 18 },
  })
}

function addCard(slide, x, y, w, h, title, body, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.1,
    line: { color: opts.line || C.line, pt: 1 },
    fill: { color: opts.fill || C.panel, transparency: opts.transparency ?? 0 },
  })
  slide.addText(title, {
    x: x + 0.18, y: y + 0.14, w: w - 0.36, h: 0.22,
    fontFace: 'Microsoft YaHei', fontSize: 14, bold: true, color: C.text, margin: 0,
  })
  slide.addText(body, {
    x: x + 0.18, y: y + 0.42, w: w - 0.36, h: h - 0.54,
    fontFace: 'Microsoft YaHei', fontSize: 10.2, color: C.muted, margin: 0,
    valign: 'top', breakLine: false,
  })
}

function addBulletBox(slide, x, y, w, h, title, items, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.1,
    line: { color: opts.line || C.line, pt: 1 },
    fill: { color: opts.fill || C.panel, transparency: opts.transparency ?? 0 },
  })
  slide.addText(title, {
    x: x + 0.18, y: y + 0.14, w: w - 0.36, h: 0.22,
    fontFace: 'Microsoft YaHei', fontSize: 14, bold: true, color: C.text, margin: 0,
  })
  const paragraphs = items.map((item) => ({
    text: item,
    options: {
      bullet: { indent: 14 },
      hanging: 2,
    },
  }))
  slide.addText(paragraphs, {
    x: x + 0.2, y: y + 0.42, w: w - 0.4, h: h - 0.52,
    fontFace: 'Microsoft YaHei', fontSize: 10.5, color: C.muted, margin: 0,
    breakLine: false, valign: 'top',
  })
}

function addTag(slide, x, y, text, fill = '123055') {
  const width = Math.max(0.72, text.length * 0.16 + 0.28)
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: width, h: 0.3,
    rectRadius: 0.12,
    line: { color: C.accent, transparency: 55, pt: 0.8 },
    fill: { color: fill, transparency: 4 },
  })
  slide.addText(text, {
    x, y: y + 0.03, w: width, h: 0.2,
    align: 'center', fontFace: 'Microsoft YaHei', fontSize: 9, color: C.text, margin: 0,
  })
  return width
}

function addSlide1() {
  const slide = pptx.addSlide()
  addBg(slide)
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.65, y: 1.7, w: 5.7, h: 3.35,
    line: { color: C.accent, transparency: 70, pt: 1 },
    fill: { color: '0C1730', transparency: 4 },
  })
  slide.addText('React 全栈管理后台', {
    x: 0.92, y: 2.05, w: 4.8, h: 0.52,
    fontFace: 'Microsoft YaHei', fontSize: 24, bold: true, color: C.text, margin: 0,
  })
  slide.addText('运营驾驶舱 / 权限菜单 / CRUD / 接口联调', {
    x: 0.95, y: 2.62, w: 4.6, h: 0.28,
    fontFace: 'Microsoft YaHei', fontSize: 12, color: C.muted, margin: 0,
  })
  slide.addText('明天面试可直接讲的项目展示稿', {
    x: 0.95, y: 3.02, w: 4.2, h: 0.24,
    fontFace: 'Microsoft YaHei', fontSize: 10.5, color: '9DB8E9', margin: 0,
  })

  const tags = ['React', 'Redux Toolkit', 'Ant Design', 'ECharts', 'Axios', 'Express', 'Vercel']
  let tx = 0.95
  tags.forEach((tag, i) => {
    const w = addTag(slide, tx, 3.5 + (i > 3 ? 0.42 : 0), tag)
    tx += w + 0.12
    if (i === 3) tx = 0.95
  })

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.75, y: 1.75, w: 5.95, h: 3.3,
    rectRadius: 0.14,
    line: { color: C.line, pt: 1 },
    fill: { color: C.panel2, transparency: 0 },
  })
  slide.addText('明天展示重点', {
    x: 7.05, y: 2.02, w: 2.4, h: 0.25,
    fontFace: 'Microsoft YaHei', fontSize: 15, bold: true, color: C.text, margin: 0,
  })
  const focus = [
    '1. 权限菜单：登录后按角色展示菜单，体现中后台系统能力。',
    '2. 数据驾驶舱：折线图、柱状图、滚动榜单、KPI 指标卡。',
    '3. 工程化：Axios 封装、路由守卫、全屏 resize、Vercel 部署。',
    '4. 联调排障：CORS、环境变量、路由重写、前后端拆分部署。',
  ]
  slide.addText(focus.map((text) => ({ text, options: { bullet: { indent: 16 } } })), {
    x: 7.02, y: 2.42, w: 5.1, h: 1.95,
    fontFace: 'Microsoft YaHei', fontSize: 11.2, color: C.muted, margin: 0,
    valign: 'top',
  })
  slide.addText('适合面试讲法：先讲业务场景，再讲难点与解决方案，最后讲上线部署。', {
    x: 7.02, y: 4.55, w: 5.1, h: 0.35,
    fontFace: 'Microsoft YaHei', fontSize: 10.2, color: 'A9C3F2', margin: 0,
  })
  addFooter(slide, 1)
}

function addSlide2() {
  const slide = pptx.addSlide()
  addBg(slide)
  addTitle(slide, '项目定位', '把“学习项目”包装成更接近企业真实场景的中后台系统')
  addCard(slide, 0.75, 1.7, 3.0, 1.35, '中后台场景', '登录、菜单、权限、列表、图表、CRUD，覆盖企业管理系统常见链路。')
  addCard(slide, 3.95, 1.7, 3.0, 1.35, '数据驾驶舱', '首页提供 KPI 指标卡、趋势图、对比图、滚动榜单，适合面试展示。')
  addCard(slide, 7.15, 1.7, 3.0, 1.35, '前后端联调', 'React 前端对接 Express API，处理 CORS、环境变量和接口异常。')
  addCard(slide, 10.35, 1.7, 2.25, 1.35, '工程化', '权限菜单、路由守卫、Axios 封装、图表 resize、部署拆分。')

  addBulletBox(slide, 0.75, 3.35, 5.9, 2.55, '项目目标', [
    '模拟企业后台的核心业务能力，而不是单纯做一个页面练习。',
    '把“权限菜单 + 数据可视化 + CRUD + 部署联调”串成完整闭环。',
    '让面试官一眼看出你具备中后台开发、问题排查和上线意识。',
  ])
  addBulletBox(slide, 6.9, 3.35, 5.7, 2.55, '岗位匹配点', [
    '对应岗位中的：前端开发与体验实现、接口对接与交互优化。',
    '对应岗位中的：技术攻坚、响应式布局、组件复用、性能优化。',
    '对应岗位中的：AI 工具应用、前后端协作、业务迭代与文档沉淀。',
  ])
  addFooter(slide, 2)
}

function addSlide3() {
  const slide = pptx.addSlide()
  addBg(slide)
  addTitle(slide, '技术架构', '前端、接口、状态、图表和部署一条线打通')
  const boxes = [
    { x: 0.7, y: 1.9, w: 2.1, h: 1.0, t: 'React UI', b: '页面、布局、路由' },
    { x: 3.1, y: 1.9, w: 2.1, h: 1.0, t: 'Redux Toolkit', b: '登录态 / 用户信息' },
    { x: 5.5, y: 1.9, w: 2.1, h: 1.0, t: 'Ant Design', b: '菜单 / 表单 / 弹窗' },
    { x: 7.9, y: 1.9, w: 2.1, h: 1.0, t: 'ECharts', b: '折线图 / 柱状图' },
    { x: 10.3, y: 1.9, w: 2.3, h: 1.0, t: 'Axios', b: '统一请求封装' },
  ]
  boxes.forEach((box) => addCard(slide, box.x, box.y, box.w, box.h, box.t, box.b))

  slide.addShape(pptx.ShapeType.line, { x: 1.75, y: 2.92, w: 0.6, h: 0, line: { color: C.accent, pt: 1.5, beginArrowType: 'none', endArrowType: 'triangle' } })
  slide.addShape(pptx.ShapeType.line, { x: 4.15, y: 2.92, w: 0.6, h: 0, line: { color: C.accent, pt: 1.5, endArrowType: 'triangle' } })
  slide.addShape(pptx.ShapeType.line, { x: 6.55, y: 2.92, w: 0.6, h: 0, line: { color: C.accent, pt: 1.5, endArrowType: 'triangle' } })
  slide.addShape(pptx.ShapeType.line, { x: 8.95, y: 2.92, w: 0.6, h: 0, line: { color: C.accent, pt: 1.5, endArrowType: 'triangle' } })

  addBulletBox(slide, 0.75, 3.35, 4.0, 2.55, '前端层', [
    'React Router 完成菜单与页面切换。',
    'Ant Design 完成后台视觉体系。',
    '使用响应式布局和全屏适配提升展示体验。',
  ])
  addBulletBox(slide, 4.95, 3.35, 4.0, 2.55, '接口层', [
    'Express 提供 RESTful API。',
    '登录、退出、用户信息、Todo、任务等接口统一管理。',
    '处理跨域、token、异常状态码和本地/线上差异。',
  ])
  addBulletBox(slide, 9.15, 3.35, 3.35, 2.55, '部署层', [
    '前后端拆分为两个 Vercel 项目。',
    '环境变量独立配置。',
    '避免单仓库混合部署导致的路由冲突。',
  ])
  addFooter(slide, 3)
}

function addSlide4() {
  const slide = pptx.addSlide()
  addBg(slide)
  addTitle(slide, '权限菜单与后台布局', '这部分最像企业中台，也是面试最容易讲出价值的一部分')
  addCard(slide, 0.75, 1.7, 3.0, 1.5, '二级菜单', '左侧菜单按业务分组，工作台 / 任务中心 / 示例页面 / 系统管理。')
  addCard(slide, 3.95, 1.7, 3.0, 1.5, '角色权限', 'admin / editor / viewer 三种角色，不同角色看到的菜单不同。')
  addCard(slide, 7.15, 1.7, 3.0, 1.5, '路由守卫', '直接访问无权限页面时拦截到 403，避免越权访问。')
  addCard(slide, 10.35, 1.7, 2.25, 1.5, '用户区', '头像、角色、退出登录，形成完整后台顶部导航。')

  addBulletBox(slide, 0.75, 3.45, 5.8, 2.35, '我在这个模块做的关键点', [
    '根据角色动态过滤菜单树，而不是只做前端显示隐藏。',
    '使用 openKeys 和 selectedKeys 管理菜单状态，保证二级菜单交互正常。',
    '退出登录后同步清理 token 和本地登录状态，避免页面残留。',
  ])
  addBulletBox(slide, 6.8, 3.45, 5.8, 2.35, '面试时可以这样讲', [
    '这是一个典型的中后台能力：权限控制、菜单树、路由守卫、顶部用户区。',
    '它不只是“能点开页面”，而是体现了真实系统里的访问控制思维。',
  ])
  addFooter(slide, 4)
}

function addSlide5() {
  const slide = pptx.addSlide()
  addBg(slide)
  addTitle(slide, '数据驾驶舱', '首页是我最想让面试官看的部分，体现数据可视化和页面组织能力')
  addCard(slide, 0.75, 1.7, 2.9, 1.25, 'KPI 指标卡', '今日交易额 / 活跃用户数 / 订单完成率 / 系统健康度')
  addCard(slide, 3.85, 1.7, 2.9, 1.25, '折线图', '展示近 7 日访问趋势，适合说明波动和变化')
  addCard(slide, 6.95, 1.7, 2.9, 1.25, '柱状图', '展示月度交易对比，突出数据对比感')
  addCard(slide, 10.05, 1.7, 2.55, 1.25, '滚动榜单', '区域销售排名，增强运营感和展示感')

  addBulletBox(slide, 0.75, 3.2, 5.9, 2.6, '这个页面的展示价值', [
    '一屏展示数据总览，适合面试时共享屏幕演示。',
    '支持全屏模式，并在全屏时主动 resize 图表，避免柱状图显示不全。',
    '适配不同分辨率，能在桌面、笔记本、平板上保持较好的视觉效果。',
  ])
  addBulletBox(slide, 6.9, 3.2, 5.7, 2.6, '如果被追问实现细节', [
    'ECharts 容器尺寸变化后手动调用 resize。',
    '滚动榜单使用 CSS 动画实现。',
    'KPI 卡和图表容器都做了响应式布局。',
  ])
  addFooter(slide, 5)
}

function addSlide6() {
  const slide = pptx.addSlide()
  addBg(slide)
  addTitle(slide, '业务模块', '用典型 CRUD 模块证明你能做真实业务，而不是只会摆页面')
  addCard(slide, 0.75, 1.75, 2.95, 1.55, 'Todo 管理', '增删改查、完成状态切换、列表刷新，典型业务操作。')
  addCard(slide, 3.9, 1.75, 2.95, 1.55, '图书管理', '查询、详情、编辑、删除，展示接口联动和弹窗表单能力。')
  addCard(slide, 7.05, 1.75, 2.95, 1.55, '职位列表', '用于展示列表渲染和搜索筛选的能力。')
  addCard(slide, 10.2, 1.75, 2.35, 1.55, '登录注册', '认证入口和用户状态切换。')

  addBulletBox(slide, 0.75, 3.6, 5.7, 2.35, '我希望面试官看到的点', [
    'CRUD 不是简单的列表，而是接口、状态、交互和错误处理的组合。',
    '我会把每个模块当成一个完整业务流程，而不是单纯写 UI。',
  ])
  addBulletBox(slide, 6.75, 3.6, 5.85, 2.35, '面试时怎么说更稳', [
    '“这个模块主要体现我对业务场景的理解：查询、编辑、删除、状态同步和反馈。”',
    '“我在实现时尽量做成通用组件思路，方便后续扩展。”',
  ])
  addFooter(slide, 6)
}

function addSlide7() {
  const slide = pptx.addSlide()
  addBg(slide)
  addTitle(slide, '工程化与部署', '这部分非常适合对应岗位里的“接口对接、性能优化、技术攻坚”')
  addBulletBox(slide, 0.75, 1.75, 3.95, 2.55, '接口封装', [
    '统一设置 Axios baseURL。',
    '通过 token 拦截器补充身份信息。',
    '统一处理 401、退出登录和错误提示。',
  ])
  addBulletBox(slide, 4.9, 1.75, 3.95, 2.55, '性能优化', [
    '图表容器 resize 适配全屏和窗口变化。',
    '首页采用卡片化布局，降低信息拥挤感。',
    '尽量减少重复逻辑，提升可维护性。',
  ])
  addBulletBox(slide, 9.05, 1.75, 3.55, 2.55, '部署问题', [
    '前后端分离成两个 Vercel 项目。',
    '解决 Root Directory / Build Command / Env 配置。',
    '处理 CORS 与路由重写问题。',
  ])

  addCard(slide, 0.75, 4.55, 12.0, 1.35, '我踩过的坑', 'Vercel 路由重写导致根路径展示错页面、CORS 导致登录 500、环境变量 secret 不存在、图表全屏时显示不全、前后端请求地址混用。', { fill: '112244' })
  addFooter(slide, 7)
}

function addSlide8() {
  const slide = pptx.addSlide()
  addBg(slide)
  addTitle(slide, '明天面试的讲述顺序', '建议按这个顺序讲，逻辑清晰，时间也容易控制在 3 到 5 分钟')
  addCard(slide, 0.8, 1.8, 3.65, 1.55, '1. 项目定位', '先说这是一个 React 全栈管理后台，面向中后台与数据驾驶舱场景。')
  addCard(slide, 4.85, 1.8, 3.65, 1.55, '2. 核心功能', '权限菜单、数据可视化、CRUD、登录认证、路由守卫。')
  addCard(slide, 8.9, 1.8, 3.65, 1.55, '3. 难点与解决', 'CORS、全屏 resize、环境变量、Vercel 拆分部署。')

  addBulletBox(slide, 0.8, 3.7, 5.8, 2.35, '一句话自我介绍项目', [
    '我做的是一个 React 全栈后台系统，包含权限菜单、数据驾驶舱、Todo 和图书管理。',
    '前端用了 React、Redux Toolkit、Ant Design、ECharts，后端是 Express，接口按 RESTful 对接。',
  ])
  addBulletBox(slide, 6.95, 3.7, 5.55, 2.35, '收尾话术', [
    '这个项目让我把页面、权限、接口、部署和排障串成了完整闭环。',
    '如果需要，我可以现场共享屏幕演示登录、权限菜单和数据驾驶舱。',
  ])
  addFooter(slide, 8)
}

addSlide1()
addSlide2()
addSlide3()
addSlide4()
addSlide5()
addSlide6()
addSlide7()
addSlide8()

await pptx.writeFile({ fileName: path.join(outDir, 'react_fullstack_interview_deck.pptx') })

const questionsMd = `# 明天面试题清单

## 项目相关

### 1. 你这个项目解决了什么问题？
答：这是一个 React 全栈后台管理系统，目标是模拟企业中后台和运营驾驶舱场景，覆盖权限菜单、数据展示、CRUD、登录认证和前后端联调。

### 2. 为什么你要把它包装成“后台管理系统”而不是普通练习项目？
答：因为岗位更关注中后台、数据驾驶舱和权限控制能力。后台管理系统更接近业务真实场景，也更容易展示工程化和问题处理能力。

### 3. 这个项目里你最满意的模块是什么？
答：我最满意的是首页数据驾驶舱和权限菜单。驾驶舱体现了图表、全屏、自适应和信息组织，权限菜单体现了后台系统的核心访问控制能力。

### 4. 你在项目里承担了什么角色？
答：我基本是独立开发，从前端布局、路由、权限、图表到后端接口联调和部署都参与了。

### 5. 如果让你用一句话介绍项目，你会怎么说？
答：这是一个 React 全栈后台系统，包含权限菜单、数据驾驶舱、Todo 和图书管理，能完整体现中后台开发链路。

## 前端基础

### 6. React 里你是怎么做路由管理的？
答：使用 React Router 管理页面切换，并结合权限守卫控制路由访问，避免无权限页面被直接访问。

### 7. 你为什么用 Redux Toolkit？
答：Redux Toolkit 能更方便地管理全局状态，比如登录态、用户信息和任务状态，比传统 Redux 更简洁。

### 8. 你是怎么处理登录状态的？
答：登录成功后把 token 存到 localStorage，页面加载时根据 token 拉取用户信息，退出登录时同步清除 token 和本地状态。

### 9. 你为什么用 Ant Design？
答：后台管理系统需要比较成熟的组件体系，Ant Design 在表单、菜单、弹窗和布局上非常适合中后台。

### 10. 你做过哪些响应式处理？
答：首页驾驶舱做了响应式布局，KPI 卡、图表和滚动榜单在不同屏幕下会自动调整；全屏模式下也会重新计算图表尺寸。

## 图表与交互

### 11. ECharts 全屏时为什么要手动 resize？
答：因为容器尺寸变化后 ECharts 不会自动完全适配，手动调用 resize 能避免柱状图或折线图显示不全。

### 12. 你为什么要做滚动榜单？
答：它能增强驾驶舱的“数据监控感”，也能体现我对数据展示组件和动效的处理能力。

### 13. 你是怎么做 KPI 卡片的？
答：把关键指标单独抽出来做成卡片，放在首页最上方，帮助面试官快速理解系统的整体数据状态。

### 14. 你怎么处理交互细节？
答：比如退出登录后立即同步状态、菜单高亮和展开状态跟随路由、全屏按钮点击后自动适配图表尺寸。

## 接口与工程化

### 15. 你是怎么对接后端接口的？
答：使用 Axios 统一请求，前端通过 RESTful API 和 Express 后端交互，登录、用户信息、Todo、图书等模块都这样对接。

### 16. 你做了哪些请求封装？
答：统一设置 baseURL，添加 token 拦截器，遇到 401 时清理登录态并跳转登录页。

### 17. 你遇到过什么部署问题？
答：有过 CORS 报 500、Vercel 路由重写错配、环境变量 secret 不存在、前后端请求地址混用等问题。

### 18. 你是怎么解决 CORS 问题的？
答：后端只允许常见本地源和 Vercel 域名，且不抛异常返回 500，而是返回可控的允许/拒绝结果。

### 19. 你是怎么处理 Vercel 的前后端部署的？
答：把前后端拆成两个项目，避免一个项目同时承担静态站点和 API 服务导致的路由冲突。

### 20. 你为什么把前端请求地址改成环境变量？
答：这样本地、预览和生产环境可以切换同一份代码，避免请求打到错误域名导致 405 或跨域问题。

## 业务与代码能力

### 21. Todo 模块为什么还值得展示？
答：因为它代表完整 CRUD，能够体现状态更新、列表刷新、删除反馈和接口联动。

### 22. 图书管理模块体现了什么能力？
答：体现表单编辑、列表查询、详情查看、更新和删除，属于典型后台业务链路。

### 23. 权限菜单为什么重要？
答：它是中后台的基础能力，体现用户角色、菜单过滤、路由守卫和页面访问控制。

### 24. 你在项目里怎么做代码组织？
答：页面、组件、服务、store、路由职责分层，避免所有逻辑堆在一个文件里。

### 25. 你如何理解“工程化”？
答：工程化不只是打包构建，而是请求封装、目录分层、组件复用、环境隔离、部署规范和可维护性。

## AI 工具与岗位匹配

### 26. 你怎么用 AI 工具？
答：我会用 ChatGPT / Copilot 处理代码补全、重构建议、排查思路和文档整理，但最终实现仍然会自己验证。

### 27. 这个岗位为什么适合你？
答：岗位强调前端开发、接口协作、性能优化、数据驾驶舱和权限菜单，这些我项目里都已经覆盖到了。

### 28. 你还有哪些可以继续优化的地方？
答：我后面可以把模拟数据改成真实接口、补充测试、抽离更通用的组件，并继续增强图表和监控能力。

### 29. 如果现场让你展示代码，你展示哪几个文件？
答：我会先展示 App 里的权限菜单和路由，再展示首页驾驶舱和图表 resize，最后展示 Todo 或图书管理的 CRUD 逻辑。

### 30. 如果面试官问“你最大的收获是什么？”
答：我最大的收获是把一个前端项目做成了完整的中后台链路，从页面、权限、接口到部署和排障都跑通了。
`

fs.writeFileSync(path.join(outDir, 'interview_questions.md'), questionsMd, 'utf8')

console.log(`Generated: ${path.join(outDir, 'react_fullstack_interview_deck.pptx')}`)
console.log(`Generated: ${path.join(outDir, 'interview_questions.md')}`)
