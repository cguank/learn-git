"use client";

import { useEffect, useState } from "react";

export default function CsrDemoClient() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function load() {
      setStatus("loading");

      try {
        const response = await fetch("/api/render-modes?mode=CSR", {
          cache: "no-store"
        });
        const json = await response.json();

        if (active) {
          setData(json);
          setStatus("success");
        }
      } catch (error) {
        if (active) {
          setStatus("error");
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <p className="emptyState">浏览器正在发起 CSR 请求，服务端先返回的是页面壳。</p>;
  }

  if (status === "error") {
    return <p className="emptyState">CSR 请求失败了，请稍后重试。</p>;
  }

  return (
    <div className="modeDetails">
      <article className="requestCard">
        <span>客户端拿到数据时间</span>
        <strong>{data.generatedAt}</strong>
      </article>
      <article className="requestCard">
        <span>请求标记</span>
        <strong>{data.requestId}</strong>
      </article>
      <p className="hint">{data.description}</p>
      <div className="qaList">
        {data.cards.map((card) => (
          <article className="qaCard" key={card.id}>
            <h3>{card.title}</h3>
            <p>{card.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
