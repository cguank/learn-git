/**
 * PWA Demo - Service Worker
 *
 * 缓存策略：
 * - install：预缓存核心资源（PRECACHE_URLS）
 * - fetch：网络优先；成功则写入缓存；失败则读缓存；再没有则返回 offline 页
 */

// 修改版本号可强制客户端丢弃旧缓存（例如 v1 → v2）
const CACHE_NAME = 'pwa-demo-v2'

// install 时预缓存 pwa 目录下的静态资源（需与 sw 同源，否则 addAll 可能整批失败）
const PRECACHE_URLS = [
  './', // 根路径，通常解析为 index.html
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './offline.html', // 离线兜底页
]

// ---------- install：首次安装或 sw.js 更新时触发 ----------
self.addEventListener('install', (event) => {
  // waitUntil：告诉浏览器在该 Promise 完成前不要把 SW 视为 install 失败
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )

  /**
   * skipWaiting()：不留在 waiting 状态，立即 activate，取代当前正在运行的旧 SW。
   * 否则新版要等用户关掉所有被旧 SW 控制的标签页后才会激活。
   */
  self.skipWaiting()
})

// ---------- activate：新版本 SW 激活时触发 ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      // 删掉除当前 CACHE_NAME 以外的旧缓存，避免磁盘堆积与策略混乱
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  )

  /**
   * clients.claim()：立刻接管当前已打开的、同 scope 下的页面。
   * 默认要等页面刷新后新 SW 才会拦截 fetch；claim 后无需刷新即可走新缓存逻辑。
   * 常与 skipWaiting() 配合，实现「新版本安装后当前页马上生效」。
   */
  self.clients.claim()
})

// ---------- fetch：页面发起的请求都会经过这里（仅 GET） ----------
self.addEventListener('fetch', (event) => {
  const { request } = event
  console.log(request)

  // 非 GET（POST 等）不缓存，直接走浏览器默认行为
  if (request.method !== 'GET') return

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Response 只能读一次，clone 后再 put 进 cache，同时把原 response 返回给页面
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, copy)
        })
        return response
      })
      .catch(() => {
        console.log('=====catch error')

        // 网络失败：先按 request 匹配缓存；没有则兜底离线页
        return
        caches
          .match(request)
          .then((cached) => cached || caches.match('./offline.html'))
      })
  )
})
