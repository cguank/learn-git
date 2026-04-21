import Link from "next/link";

import ModeNav from "../../components/ModeNav";

const questions = [
  {
    question: "SSR 和 CSR 的核心区别是什么？",
    answer:
      "SSR 是服务端先生成 HTML 再返回给浏览器，CSR 通常先返回空壳 HTML，再由浏览器执行 JavaScript 获取数据并渲染内容。"
  },
  {
    question: "为什么 SSR 对 SEO 更友好？",
    answer:
      "因为搜索引擎拿到的初始 HTML 已经包含主要内容，不需要依赖浏览器执行完前端脚本后才看到页面主体。"
  },
  {
    question: "什么情况下不适合强制使用 SSR？",
    answer:
      "如果页面内容几乎不变、对首屏动态性要求不高，或者访问量很大但个性化很少，静态生成和缓存策略通常更划算。"
  },
  {
    question: "Next.js 里怎么区分 Server Component 和 Client Component？",
    answer:
      "默认是 Server Component，只有文件顶部写了 \"use client\" 才会变成 Client Component。"
  }
];

export const metadata = {
  title: "SSR Interview Notes",
  description: "A simple interview prep page for SSR fundamentals."
};

export default function InterviewPage() {
  return (
    <main className="page">
      <ModeNav />
      <section className="hero">
        <p className="eyebrow">Interview Route</p>
        <h1>SSR 面试速记页</h1>
        <p className="intro">
          这个页面对应真实子路由 <code>/interview</code>。它用来帮助你把 SSR 的高频问题和回答结构练熟。
        </p>
        <div className="heroActions">
          <Link className="refreshButton" href="/">
            返回首页
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2>高频问题</h2>
        <div className="qaList">
          {questions.map((item) => (
            <article className="qaCard" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel steps">
        <h2>这个页面说明了什么</h2>
        <ol>
          <li>`app/interview/page.js` 会自动映射成 `/interview`。</li>
          <li>你不需要手写路由表，Next.js 会根据文件系统生成路由。</li>
          <li>同理，`app/ssr/page.js`、`app/csr/page.js`、`app/ssg/page.js`、`app/isr/page.js` 也会生成对应路径。</li>
        </ol>
      </section>
    </main>
  );
}
