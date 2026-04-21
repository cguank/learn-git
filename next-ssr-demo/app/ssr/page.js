import ModeNav from "../../components/ModeNav";
import { getRenderModeSnapshot } from "../../lib/renderModes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SSR Demo",
  description: "Request-time server rendering example."
};

export default async function SsrPage() {
  const data = await getRenderModeSnapshot("SSR");

  return (
    <main className="page">
      <ModeNav />
      <section className="hero">
        <p className="eyebrow">SSR Page</p>
        <h1>每次请求都在服务端重新生成</h1>
        <p className="intro">{data.description}</p>
      </section>

      <section className="statsGrid">
        <article className="statCard">
          <span>HTML 生成时间</span>
          <strong>{data.generatedAt}</strong>
        </article>
        <article className="statCard">
          <span>请求标记</span>
          <strong>{data.requestId}</strong>
        </article>
        <article className="statCard">
          <span>模式</span>
          <strong>{data.mode}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>你应该观察什么</h2>
        <div className="qaList">
          {data.cards.map((card) => (
            <article className="qaCard" key={card.id}>
              <h3>{card.title}</h3>
              <p>{card.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
