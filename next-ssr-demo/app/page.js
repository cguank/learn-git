import { cookies, headers } from "next/headers";
import Link from "next/link";

import FilterBar from "../components/FilterBar";
import ModeNav from "../components/ModeNav";
import PreferenceForm from "../components/PreferenceForm";
import RefreshButton from "../components/RefreshButton";
import { getAllCategories, getArticles, getDashboardStats } from "../lib/articles";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const category = searchParams?.category || "all";
  const keyword = searchParams?.keyword || "";

  return {
    title:
      category === "all"
        ? "Next.js SSR Interview Demo"
        : `${category} - Next.js SSR Interview Demo`,
    description: keyword
      ? `演示 SSR 搜索与筛选，当前关键词：${keyword}`
      : "一个适合准备 SSR 面试的 Next.js 动态服务端渲染示例。"
  };
}

export default async function HomePage({ searchParams }) {
  const cookieStore = cookies();
  const headerStore = headers();
  const preferredCategory = cookieStore.get("preferredCategory")?.value || "all";
  const category = searchParams?.category || preferredCategory;
  const keyword = searchParams?.keyword || "";
  const sort = searchParams?.sort || "difficulty";
  const categories = getAllCategories();
  const [{ totalArticles, categories: categoryCount, avgMinutes }, articles] =
    await Promise.all([
      getDashboardStats(),
      getArticles({ category, keyword, sort })
    ]);
  const serverTime = new Date().toLocaleString("zh-CN", {
    hour12: false
  });
  const requestInfo = [
    {
      label: "渲染时间",
      value: serverTime
    },
    {
      label: "User-Agent",
      value: headerStore.get("user-agent")?.slice(0, 72) || "未获取到"
    },
    {
      label: "语言偏好",
      value: headerStore.get("accept-language") || "未获取到"
    },
    {
      label: "Cookie 默认分类",
      value: preferredCategory
    }
  ];

  return (
    <main className="page">
      <ModeNav />
      <section className="hero">
        <p className="eyebrow">Next.js SSR Demo</p>
        <h1>这是一个更接近面试场景的 SSR 学习项目</h1>
        <p className="intro">
          当前页面由服务端生成，并额外演示了 URL 驱动筛选、Cookie 个性化、请求头读取、并行数据获取和客户端触发服务端重渲染。上方导航新增了 SSR、CSR、SSG、ISR 四个对照页面。
        </p>
        <div className="heroActions">
          <RefreshButton />
          <Link className="secondaryButton" href="/interview">
            打开面试速记页
          </Link>
        </div>
      </section>

      <section className="statsGrid">
        <article className="statCard">
          <span>文章数</span>
          <strong>{totalArticles}</strong>
        </article>
        <article className="statCard">
          <span>知识分类</span>
          <strong>{categoryCount}</strong>
        </article>
        <article className="statCard">
          <span>平均阅读时长</span>
          <strong>{avgMinutes} 分钟</strong>
        </article>
      </section>

      <section className="panel">
        <h2>服务端筛选与个性化</h2>
        <p className="hint">筛选条件写进 URL，默认偏好存进 Cookie，二者都在服务端读取。</p>
        <FilterBar categories={categories} />
        <PreferenceForm categories={categories} preferredCategory={preferredCategory} />
      </section>

      <section className="panel">
        <h2>服务端获取的数据</h2>
        <p className="hint">
          当前条件：分类 {category}，关键词 {keyword || "无"}，排序 {sort === "duration" ? "按时长" : "按难度"}
        </p>
        <ul className="articleList">
          {articles.map((article) => (
            <li className="articleCard" key={article.id}>
              <span className="badge">{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <dl className="articleMeta">
                <div>
                  <dt>难度</dt>
                  <dd>{article.difficulty}</dd>
                </div>
                <div>
                  <dt>时长</dt>
                  <dd>{article.minutes} 分钟</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        {articles.length === 0 ? <p className="emptyState">没有匹配的内容，试试换个关键词。</p> : null}
      </section>

      <section className="panel">
        <h2>请求级 SSR 信息</h2>
        <p className="hint">这些信息都是当前请求在服务端渲染时拿到的，可用于个性化和设备适配。</p>
        <div className="requestGrid">
          {requestInfo.map((item) => (
            <article className="requestCard" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="panel steps">
        <h2>你能从这个 demo 学到什么</h2>
        <ol>
          <li>`app/page.js` 是服务端组件，可以直接读取 searchParams、cookies 和 headers。</li>
          <li>服务端可并行获取多个数据源，减少总等待时间。</li>
          <li>`dynamic = "force-dynamic"` 让页面每次请求都执行服务端渲染。</li>
          <li>客户端组件只负责交互，真正的数据筛选仍然回到服务端完成。</li>
          <li>Server Action 可以写 Cookie 并触发页面重新验证。</li>
        </ol>
      </section>
    </main>
  );
}
