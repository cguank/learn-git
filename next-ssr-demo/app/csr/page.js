import ModeNav from "../../components/ModeNav";
import CsrDemoClient from "../../components/CsrDemoClient";

export const metadata = {
  title: "CSR Demo",
  description: "Client-side rendering example."
};

export default function CsrPage() {
  return (
    <main className="page">
      <ModeNav />
      <section className="hero">
        <p className="eyebrow">CSR Page</p>
        <h1>浏览器拿到壳之后，再由 React 请求数据</h1>
        <p className="intro">
          这个页面的关键信息不是在服务端首屏里直接带回来的，而是客户端组件挂载后通过 fetch 获取。
        </p>
      </section>

      <section className="panel">
        <h2>CSR 运行结果</h2>
        <CsrDemoClient />
      </section>

      <section className="panel steps">
        <h2>面试回答重点</h2>
        <ol>
          <li>SSR 首屏 HTML 更完整，CSR 首屏通常先是壳。</li>
          <li>CSR 的数据请求在浏览器发生，更依赖客户端 JavaScript。</li>
          <li>高交互后台系统常见 CSR，但公开内容页通常更看重 SSR 或静态方案。</li>
        </ol>
      </section>
    </main>
  );
}
