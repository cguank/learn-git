import ModeNav from "../../components/ModeNav";
import { getRenderModeSnapshot } from "../../lib/renderModes";

export const metadata = {
  title: "SSG Demo",
  description: "Static site generation example."
};

export default async function SsgPage() {
  const data = await getRenderModeSnapshot("SSG");

  return (
    <main className="page">
      <ModeNav />
      <section className="hero">
        <p className="eyebrow">SSG Page</p>
        <h1>构建时生成一次，访问时直接返回静态内容</h1>
        <p className="intro">{data.description}</p>
      </section>

      <section className="statsGrid">
        <article className="statCard">
          <span>构建产物时间</span>
          <strong>{data.generatedAt}</strong>
        </article>
        <article className="statCard">
          <span>构建标记</span>
          <strong>{data.requestId}</strong>
        </article>
        <article className="statCard">
          <span>模式</span>
          <strong>{data.mode}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>你应该观察什么</h2>
        <p className="hint">如果你不重新 build，这里的时间在生产环境会保持不变，因为 HTML 已经提前生成好了。</p>
        <div className="qaList">
          {data.cards.map((card) => (
            <article className="qaCard" key={card.id}>
              <h3>{card.focus}</h3>
              <p>{card.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
