"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function FilterBar({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateSearchParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="filters">
      <label className="field">
        <span>分类</span>
        <select
          defaultValue={searchParams.get("category") || "all"}
          onChange={(event) => updateSearchParam("category", event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "全部" : category}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>关键词</span>
        <input
          defaultValue={searchParams.get("keyword") || ""}
          placeholder="输入 SSR、SEO、缓存..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              updateSearchParam("keyword", event.currentTarget.value);
            }
          }}
        />
      </label>

      <label className="field">
        <span>排序</span>
        <select
          defaultValue={searchParams.get("sort") || "difficulty"}
          onChange={(event) => updateSearchParam("sort", event.target.value)}
        >
          <option value="difficulty">按难度</option>
          <option value="duration">按时长</option>
        </select>
      </label>

      <p className="pendingText">{isPending ? "服务端正在重新渲染..." : "筛选由 URL 驱动，可直接分享链接。"}</p>
    </div>
  );
}
