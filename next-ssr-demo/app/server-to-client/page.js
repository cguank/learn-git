import ModeNav from "../../components/ModeNav";
import ClientPropsDemo from "../../components/ClientPropsDemo";
import { getRenderModeSnapshot } from "../../lib/renderModes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Server To Client Demo",
  description: "Server data passed into a client component for interaction."
};

export default async function ServerToClientPage() {
  const snapshot = await getRenderModeSnapshot("SSR");

  return (
    <main className="page">
      <ModeNav />
      <section className="hero">
        <p className="eyebrow">Server To Client</p>
        <h1>服务端取数，客户端交互</h1>
        <p className="intro">
          这个页面专门演示一个常见模式：Server Component 先在服务端拿到数据，然后把它作为 props 传给 Client Component。这样首屏内容完整，交互也仍然由 React 在浏览器里处理。
        </p>
      </section>

      <section className="panel steps">
        <h2>执行流程</h2>
        <ol>
          <li>`app/server-to-client/page.js` 在服务端执行，并调用 `getRenderModeSnapshot()`。</li>
          <li>服务端把拿到的 `snapshot` 作为 `initialSnapshot` 传给 `ClientPropsDemo`。</li>
          <li>浏览器 hydration 之后，客户端组件可以基于这份初始数据做点赞等本地交互。</li>
          <li>本地交互不会让服务端重新查询这批数据，除非你主动发请求或刷新页面。</li>
        </ol>
      </section>

      <ClientPropsDemo initialSnapshot={snapshot} />
    </main>
  );
}
