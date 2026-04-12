# 不同缓存策略
HTML / 页面路由：NetworkFirst 或 Stale-While-Revalidate
JS/CSS/ 字体 / 图片：CacheFirst
核心静态壳资源：CacheOnly（预缓存）
支付 / 验证码 / 实时接口：NetworkOnly
列表 / 配置数据：NetworkFirst
头像 / 非关键数据：Stale-While-Revalidate

Cache First 是 “能用缓存就绝不发网络”；
Stale-While-Revalidate 静默更新 是 “先给缓存，同时后台发请求更新，下次生效”。
Cache Only 只使用缓存，缓存不存在就失败，完全不发网络，适合预缓存的应用壳资源。
Cache First 优先用缓存，缓存没有才走网络并自动缓存，适合图片、JS、CSS 等静态资源。

# PWA Demo

最小可运行 PWA 演示：**Manifest + Service Worker + 安装提示 + 离线页**。

## 如何运行

Service Worker 只在 **HTTPS** 或 **localhost** 下可用，不能直接 `file://` 打开。

```bash
# 进入 pwa 目录后启动静态服务（任选其一）
cd pwa
npx --yes serve .
# 或
python3 -m http.server 8080
```

浏览器访问：`http://localhost:3000`（serve 默认端口）或 `http://localhost:8080`。

## 文件说明

| 文件 | 作用 |
|------|------|
| `manifest.json` | Web App Manifest：名称、图标、standalone、主题色 |
| `sw.js` | Service Worker：安装时预缓存，离线时走缓存或 `offline.html` |
| `index.html` | 入口页，注册 SW，监听 `beforeinstallprompt` 显示安装按钮 |
| `offline.html` | 无网络且未命中缓存时的兜底页 |
| `icon-*.svg` | 安装与添加到主屏幕用的图标 |

## 验证

1. **Application → Manifest**（Chrome DevTools）应能看到清单。
2. **Application → Service Workers** 应显示已激活。
3. 断网刷新：若已缓存过，仍应能打开；未缓存资源会显示离线页。
4. 地址栏或菜单可能出现「安装」；移动端可「添加到主屏幕」。

## 注意

- 部分浏览器对 Manifest 里 **SVG 图标** 支持不完整，若安装 criteria 不满足，可换成 192/512 的 **PNG** 图标。
- 更新 `sw.js` 后需改 `CACHE_NAME`（例如 `v2`）以便客户端拉取新缓存。
