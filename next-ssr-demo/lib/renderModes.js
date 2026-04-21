const topicCards = [
  {
    id: "seo",
    title: "SEO 可见性",
    summary: "首屏内容是否在初始 HTML 中，直接影响搜索引擎和社交分享预览。",
    focus: "首屏 HTML"
  },
  {
    id: "performance",
    title: "首屏体验",
    summary: "不同渲染模式对首屏可见内容、数据等待位置和交互接管时机的影响不同。",
    focus: "内容到达时机"
  },
  {
    id: "cost",
    title: "服务端成本",
    summary: "不是所有页面都要请求级渲染，稳定内容通常更适合静态化或增量再生。",
    focus: "缓存策略"
  }
];

const modeDescriptions = {
  SSR: "每次请求都在服务端生成 HTML，适合强个性化、强实时性的页面。",
  CSR: "服务端先返回壳，浏览器再请求数据并渲染，交互灵活但首屏内容通常更晚出现。",
  SSG: "构建时生成静态 HTML，适合稳定内容，访问快且成本低。",
  ISR: "页面先静态化，再按间隔重新生成，兼顾性能和更新频率。"
};

export async function getRenderModeSnapshot(mode) {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    mode,
    generatedAt: new Date().toLocaleString("zh-CN", {
      hour12: false
    }),
    requestId: Math.random().toString(36).slice(2, 8),
    description: modeDescriptions[mode],
    cards: topicCards
  };
}
