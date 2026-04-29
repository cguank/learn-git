"use client";

import { useState } from "react";

export default function ClientPropsDemo({ initialSnapshot }) {
  const [likedIds, setLikedIds] = useState([]);

  const toggleLike = (id) => {
    setLikedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <section className="panel">
      <h2>客户端接收到的服务端数据</h2>
      <p className="hint">
        下面这些卡片数据由服务端先查好，再通过 props 传进客户端组件。点击按钮只会更新浏览器本地状态，不会重新向服务端取这批数据。
      </p>

      <div className="requestGrid">
        <article className="requestCard">
          <span>服务端生成时间</span>
          <strong>{initialSnapshot.generatedAt}</strong>
        </article>
        <article className="requestCard">
          <span>服务端请求标记</span>
          <strong>{initialSnapshot.requestId}</strong>
        </article>
      </div>

      <div className="qaList">
        {initialSnapshot.cards.map((card) => {
          const liked = likedIds.includes(card.id);

          return (
            <article className="qaCard" key={card.id}>
              <h3>{card.title}</h3>
              <p>{card.summary}</p>
              <div className="cardFooter">
                <span className="badge">{card.focus}</span>
                <button className="secondaryButton" onClick={() => toggleLike(card.id)} type="button">
                  {liked ? "已点赞" : "点赞"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
