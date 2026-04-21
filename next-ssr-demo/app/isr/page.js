import ModeNav from "../../components/ModeNav";
import { getRenderModeSnapshot } from "../../lib/renderModes";

export const revalidate = 15;

export const metadata = {
  title: "ISR Demo",
  description: "Incremental static regeneration example."
};

export default async function IsrPage() {
  const data = await getRenderModeSnapshot("ISR");

  return (
    <main className="page">
      <ModeNav />
      <section className="hero">
        <p className="eyebrow">ISR Page</p>
        <h1>静态页面定时再生</h1>
        <p className="intro">
          {data.description} 这个页面设置了 <code>revalidate = 15</code>，意味着缓存过期后下一次请求会触发重新生成。
        </p>
      </section>

      <section className="statsGrid">
        <article className="statCard">
          <span>最近生成时间</span>
          <strong>{data.generatedAt}</strong>
        </article>
        <article className="statCard">
          <span>生成标记</span>
          <strong>{data.requestId}</strong>
        </article>
        <article className="statCard">
          <span>重新生成间隔</span>
          <strong>15 秒</strong>
        </article>
      </section>

      <section className="panel steps">
        <h2>面试回答重点</h2>
        <ol>
          <li>它不是每次请求都重新渲染，所以成本通常低于 SSR。</li>
          <li>它也不是永远固定不变，所以比纯 SSG 更适合会定期更新的内容。</li>
          <li>Next.js 官方更常用的叫法就是 ISR，意思是增量静态再生。</li>
        </ol>
      </section>
    </main>
  );
}
