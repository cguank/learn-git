const articles = [
  {
    id: 1,
    category: "SSR",
    title: "服务端先拿数据",
    summary: "浏览器收到的是已经带内容的 HTML，首屏更完整。",
    difficulty: "初级",
    minutes: 8
  },
  {
    id: 2,
    category: "SEO",
    title: "搜索引擎更容易理解内容",
    summary: "因为重要内容在 HTML 返回时就已经存在，不依赖前端再补数据。",
    difficulty: "中级",
    minutes: 10
  },
  {
    id: 3,
    category: "Hydration",
    title: "HTML 先展示，JavaScript 再接管交互",
    summary: "这是 Next.js SSR 入门时最值得先理解的一步。",
    difficulty: "中级",
    minutes: 12
  },
  {
    id: 4,
    category: "Caching",
    title: "什么时候不要把页面做成完全动态",
    summary: "不是所有页面都要每次请求都重新渲染，缓存策略也是面试重点。",
    difficulty: "高级",
    minutes: 14
  },
  {
    id: 5,
    category: "Streaming",
    title: "慢数据分段返回给浏览器",
    summary: "通过 Suspense 和流式传输，用户可以更早看到首屏结构。",
    difficulty: "高级",
    minutes: 16
  },
  {
    id: 6,
    category: "Server Actions",
    title: "服务端写入与页面再验证",
    summary: "服务端动作让表单提交不必一定经过单独 API，也能驱动 SSR 更新。",
    difficulty: "高级",
    minutes: 18
  }
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getArticles({
  category = "all",
  keyword = "",
  sort = "difficulty"
} = {}) {
  await delay(500);

  const normalizedKeyword = keyword.trim().toLowerCase();

  let result = articles.filter((article) => {
    const matchCategory = category === "all" || article.category === category;
    const matchKeyword =
      normalizedKeyword.length === 0 ||
      article.title.toLowerCase().includes(normalizedKeyword) ||
      article.summary.toLowerCase().includes(normalizedKeyword);

    return matchCategory && matchKeyword;
  });

  if (sort === "duration") {
    result = result.sort((a, b) => a.minutes - b.minutes);
  } else {
    const order = {
      初级: 1,
      中级: 2,
      高级: 3
    };
    result = result.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  }

  return result;
}

export async function getDashboardStats() {
  await delay(300);

  return {
    totalArticles: articles.length,
    categories: new Set(articles.map((article) => article.category)).size,
    avgMinutes: Math.round(
      articles.reduce((total, article) => total + article.minutes, 0) / articles.length
    )
  };
}

export function getAllCategories() {
  return ["all", ...new Set(articles.map((article) => article.category))];
}
