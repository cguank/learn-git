import axios from 'axios'

const service = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true, // 必须开！让浏览器自动带 Cookie(RT)
})

// ====================
// 1. Access Token 存在内存（最安全）
// ====================
let accessToken = ''

export const setAccessToken = (token) => {
  accessToken = token
}

// ====================
// 2. 刷新锁 + 队列
// ====================
let isRefreshing = false
let requestQueue = []

// ====================
// 3. 刷新接口（RT 自动在 Cookie 里，不用传！）主流方案
// 放在localStorage里容易被xss偷
// 重要接口还是需要csrf token防csrf
// 关闭标签页后 CSRF Token 虽然会丢失，但不会造成安全风险，因为前端重新进入页面时会调用一个初始化接口，由后端动态生成一个新的 CSRF Token 并返回给前端，前端存入内存后再使用。这样每次会话都有全新的 CSRF Token，攻击者无法预测或伪造，从而保证了 /refresh-token 接口的 CSRF 安全。
// ====================
const refreshToken = () => {
  return service.post(
    '/user/refresh',
    {},
    {
      _retry: true, // 标记是刷新请求，避免死循环
    },
  )
}

// ====================
// 4. 请求拦截器
// ====================
service.interceptors.request.use(
  (config) => {
    // 正常接口带上 AT
    if (accessToken && !config._retry) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ====================
// 5. 响应拦截器（核心无感刷新）
// ====================
service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const originalReq = error.config

    // 防止刷新接口也 401 导致死循环
    if (originalReq._retry) {
      // 刷新失败 → 跳登录
      accessToken = ''
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // 401 = AT 过期
    if (error.response?.status === 401) {
      originalReq._retry = true

      if (!isRefreshing) {
        isRefreshing = true

        // 开始刷新（RT 自动在 Cookie 里）
        return refreshToken()
          .then((res) => {
            const newAT = res.data.accessToken
            accessToken = newAT

            // 重试队列
            requestQueue.forEach((cb) => cb(newAT))
            requestQueue = []

            // 重试当前请求
            return service(originalReq)
          })
          .catch(() => {
            accessToken = ''
            window.location.href = '/login'
          })
          .finally(() => {
            isRefreshing = false
          })
      }

      // 正在刷新 → 进入队列
      return new Promise((resolve) => {
        requestQueue.push((newToken) => {
          originalReq.headers.Authorization = `Bearer ${newToken}`
          resolve(service(originalReq))
        })
      })
    }

    return Promise.reject(error)
  },
)

export default service
