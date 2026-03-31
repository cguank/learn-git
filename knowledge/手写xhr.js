/**
 * 手写 XMLHttpRequest + Promise（面试高频）
 *
 * 记忆口诀：open → onload 判 status → onerror reject → send
 * 易错点：onload 在 404/500 时也会触发，必须看 xhr.status，不能只看“加载完成”。
 */

/**
 * @param {string} method GET / POST / PUT / DELETE …
 * @param {string} url
 * @param {object|string|FormData|null} [data] 可选
 *   - GET：普通对象会转成查询串 ?a=1&b=2 拼在 url 后面
 *   - POST 等：普通对象会 JSON.stringify，并设 Content-Type: application/json
 *   - 传 FormData：直接作为 body，不要手动设 Content-Type（浏览器带 boundary）
 *   - 已是字符串：原样放进 body（自行保证与 Header 一致）
 */
function request(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const m = method.toUpperCase()
    let finalUrl = url
    let body = null

    // GET：data 拼到 URL；有 body 的语义也不常用 GET
    if (
      data != null &&
      m === 'GET' &&
      typeof data === 'object' &&
      !(data instanceof FormData)
    ) {
      const q = new URLSearchParams(data).toString()
      if (q) finalUrl += (finalUrl.includes('?') ? '&' : '?') + q
    } else if (data != null && m !== 'GET') {
      if (data instanceof FormData) {
        body = data
      } else if (typeof data === 'string') {
        body = data
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        body = JSON.stringify(data)
      }
    }

    // 1. 初始化请求：方法 + URL（第三个参数 true 表示异步，可省略，默认就是异步）
    xhr.open(m, finalUrl)

    // 2. 响应到达且解析完成（含 4xx/5xx，都会进 onload）
    xhr.onload = function () {
      // HTTP 层成功：2xx；否则按失败处理（面试常考点）
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText)
      } else {
        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
      }
    }

    // 3. 网络错误（断网、跨域被拦等），不会进 onload
    xhr.onerror = function () {
      reject(new Error('Network error'))
    }

    // 4. 发送：GET 一般为 null；POST/PUT 等为 body
    xhr.send(body)
  })
}

// 使用示例：
// request('GET', '/api/user', { id: 1 })           // → /api/user?id=1
// request('POST', '/api/login', { user: 'a' })   // JSON body
// request('POST', '/api/upload', formData)         // FormData，不设 JSON 头
