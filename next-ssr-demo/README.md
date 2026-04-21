# Next.js SSR Interview Demo

这是一个适合学习和面试讲解的 Next.js SSR demo，不只是“能跑”，还尽量覆盖你在面试里常被问到的点。

## 这个项目演示了什么

- SSR、CSR、SSG、ISR 四种渲染模式对比
- 服务端组件直接获取数据
- `dynamic = "force-dynamic"` 的真正含义
- 基于 `searchParams` 的服务端筛选和排序
- 基于 `cookies()` 的个性化渲染
- 基于 `headers()` 的请求级信息读取
- `router.refresh()` 如何触发服务端重新渲染
- Server Action 如何写 Cookie 并触发重新验证
- `loading.js` 如何配合动态页面展示加载态
- `generateMetadata()` 如何根据请求动态生成 SEO 信息

## 运行方式

```bash
cd next-ssr-demo
npm install
npm run dev
```

浏览器打开：

```bash
http://localhost:3000
```

## 目录结构说明

```text
next-ssr-demo/
├── app/
│   ├── api/
│   │   └── render-modes/route.js # 给 CSR 页面提供演示接口
│   ├── actions.js        # Server Actions，写 Cookie 并触发 revalidate
│   ├── csr/page.js       # CSR 示例页
│   ├── globals.css       # 全局样式
│   ├── interview/page.js # 面试速记页
│   ├── isr/page.js       # ISR 示例页
│   ├── layout.js         # 根布局和 metadata
│   ├── loading.js        # 动态渲染中的加载占位
│   └── page.js           # 核心 SSR 页面
│   ├── ssg/page.js       # SSG 示例页
│   └── ssr/page.js       # SSR 示例页
├── components/
│   ├── CsrDemoClient.js  # CSR 客户端取数组件
│   ├── FilterBar.js      # 客户端筛选栏，修改 URL 查询参数
│   ├── ModeNav.js        # 四种渲染模式的统一导航
│   ├── PreferenceForm.js # 提交服务端动作，保存默认分类偏好
│   └── RefreshButton.js  # 客户端刷新按钮，触发 router.refresh()
├── lib/
│   └── articles.js       # 模拟数据源、筛选逻辑和统计逻辑
├── next.config.mjs       # Next.js 配置
├── package.json          # 项目脚本和依赖
└── README.md             # 项目说明
```

## 四种渲染模式对比

| 模式 | HTML 什么时候生成 | 数据主要在哪拿 | 优点 | 缺点 | 适合场景 |
| --- | --- | --- | --- | --- | --- |
| SSR | 每次请求时 | 服务端 | 首屏完整，SEO 好，可做个性化和实时内容 | 服务端压力更大，响应更依赖服务端速度 | 搜索页、个性化首页、实时内容页 |
| CSR | 浏览器加载后 | 客户端 | 前端交互灵活，状态管理自由 | 首屏可能只有壳，SEO 较弱 | 后台系统、强交互控制台 |
| SSG | 构建时 | 构建阶段 | 访问快，成本低，稳定 | 内容更新通常要重新构建 | 文档站、博客、官网介绍页 |
| ISR | 构建后按间隔再生 | 服务端按再生时机更新 | 兼顾性能和更新频率 | 不是绝对实时，有缓存窗口 | 商品列表、内容站、资讯页 |

## 对应页面说明

- `/ssr`：请求级服务端渲染，每次访问都会重新生成时间和请求标记
- `/csr`：首屏先返回页面壳，浏览器挂载后再请求 `/api/render-modes`
- `/ssg`：构建时生成静态内容，不重新 build 的话生成时间会保持不变
- `/isr`：设置了 `revalidate = 15`，会在静态页面基础上定期重新生成

## 你可以从哪些角度理解这个项目

### 1. 页面为什么是 SSR

`app/page.js` 里有：

```js
export const dynamic = "force-dynamic";
```

这代表当前页面不走静态生成，而是在每次请求时都由服务端重新执行。也就是说：

- 服务端会重新读取 `searchParams`
- 服务端会重新读取 `cookies`
- 服务端会重新读取 `headers`
- 服务端会重新获取文章数据和统计数据

所以这个页面是典型的“请求级 SSR 页面”。

### 2. 客户端和服务端分别做什么

这个项目故意把职责拆开，方便面试讲清楚：

- `page.js` 负责服务端数据获取和 HTML 生成
- `FilterBar.js` 负责浏览器里的交互，把筛选条件写进 URL
- `RefreshButton.js` 负责触发 `router.refresh()`
- `PreferenceForm.js` 负责提交表单给 Server Action
- `articles.js` 负责模拟数据库查询、筛选、排序和统计

一句话总结就是：

> 客户端负责交互，服务端负责数据和最终页面。

### 3. 为什么筛选适合放到服务端

项目里分类、关键词、排序都通过 URL 传给服务端，然后由 `getArticles()` 在服务端处理。

这样做的好处是：

- 首屏 HTML 就是筛选后的最终内容
- URL 可分享、可收藏
- 搜索引擎抓到的是结果页，不是空壳页
- 服务端可以直接接数据库查询，而不是把全部数据先传到浏览器再筛选

### 4. Cookie 个性化有什么面试价值

项目里可以把“默认分类偏好”保存到 Cookie。

这样下次请求页面时，服务端可以在 `page.js` 里通过 `cookies()` 直接读到它，再决定默认显示什么内容。这是很典型的 SSR 个性化能力，比如：

- 默认语言
- 城市
- 主题
- 用户偏好的内容分类

### 5. Headers 能讲什么

项目里通过 `headers()` 读取了：

- `user-agent`
- `accept-language`

这在面试里很常见，因为它能延伸到：

- 设备识别
- 国际化
- A/B Test
- 地区化展示

### 6. 为什么要有 `loading.js`

动态页面请求服务端时，如果数据比较慢，用户不能一直看空白页。

`app/loading.js` 提供了一个加载中的占位界面。它通常会和以下概念一起出现：

- Suspense
- Streaming
- 慢接口优化
- 首屏体验优化

### 7. `generateMetadata()` 的价值

这个项目会根据当前筛选条件生成标题和描述。这样你可以在面试里说明：

- SSR 页面可以动态产出 SEO 信息
- metadata 可以和当前请求状态绑定
- 列表页、搜索页、分类页都适合这样做

### 8. 四种模式在代码里分别怎么落地

- `app/ssr/page.js`：通过 `dynamic = "force-dynamic"` 明确指定请求级 SSR
- `app/csr/page.js`：页面本身是静态壳，真正的数据请求发生在客户端组件 `CsrDemoClient`
- `app/ssg/page.js`：没有动态标记，也没有 `revalidate`，因此会在构建时静态生成
- `app/isr/page.js`：通过 `export const revalidate = 15` 开启增量静态再生

## 面试时你可以怎么讲

你可以按这个顺序回答：

1. 这个项目基于 Next.js App Router，核心页面是服务端组件。
2. 页面通过 `force-dynamic` 保证每次请求都在服务端重新渲染。
3. 服务端会读取 URL 参数、Cookie 和请求头，再并行获取数据。
4. 客户端组件只负责交互，比如改筛选条件、触发刷新、提交表单。
5. 由于最终 HTML 是服务端生成的，所以首屏更完整，也更利于 SEO。
6. 如果后续要继续扩展，可以再引入缓存策略、Streaming、真实数据库和鉴权。

如果面试官追问 SSR、CSR、SSG、ISR 的区别，你可以直接这样回答：

> SSR 是请求时渲染，CSR 是浏览器拿到壳后再请求数据，SSG 是构建时生成静态 HTML，ISR 是在静态化基础上按周期重新生成。它们的核心差异是 HTML 生成时机、数据获取位置，以及性能和实时性的权衡。

## 你可以重点看的文件

- `app/page.js`：核心 SSR 页面，面试讲解重点
- `app/ssr/page.js`：请求级 SSR 示例
- `app/csr/page.js`：CSR 示例页
- `app/ssg/page.js`：SSG 示例页
- `app/isr/page.js`：ISR 示例页
- `app/api/render-modes/route.js`：CSR 示例用到的本地接口
- `app/actions.js`：Server Action 写 Cookie
- `components/CsrDemoClient.js`：客户端请求数据的典型写法
- `components/FilterBar.js`：客户端如何驱动服务端筛选
- `components/RefreshButton.js`：客户端如何触发 SSR 重跑
- `lib/articles.js`：服务端数据获取和筛选逻辑
- `app/loading.js`：加载态和慢请求体验

## 面试延伸问题

你可以顺着这个 demo 再准备这些问题：

- SSR 和 SSG 的区别是什么？
- 为什么 `router.refresh()` 不等于浏览器整页刷新？
- Server Component 和 Client Component 的边界怎么划分？
- `cookies()` 和 `headers()` 为什么更适合在服务端读取？
- 什么情况下不应该使用 `force-dynamic`？
- SSR 页面如何做缓存和增量更新？
- Streaming 和 Hydration 分别解决什么问题？

## 一句话总结

这个 demo 的目标不是只让你“看到 SSR”，而是让你能把 SSR 的运行过程、职责拆分、SEO、个性化和面试延伸问题一起讲明白。
