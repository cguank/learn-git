// 极简History路由实现
class HistoryRouter {
  constructor() {
    this.routes = {}
    // 监听popstate事件（处理浏览器前进后退）
    window.addEventListener('popstate', this.handlePopState.bind(this))
    // 页面加载时处理初始路径
    window.addEventListener('load', this.handlePopState.bind(this))
  }

  // 注册路由
  register(path, callback) {
    this.routes[path] = callback
  }

  // 处理popstate事件
  handlePopState() {
    const currentPath = window.location.pathname
    const callback = this.routes[currentPath]
    if (callback) {
      callback()
    } else {
      console.log('404 Not Found')
    }
  }

  // 编程式导航（核心！）
  push(path) {
    // 修改URL并添加历史记录，但不刷新页面
    history.pushState(null, '', path)
    // 手动触发路由处理
    this.handlePopState()
  }

  // 替换当前路由
  replace(path) {
    history.replaceState(null, '', path)
    this.handlePopState()
  }

  // 前进后退
  go(n) {
    window.history.go(n)
  }
}

// 使用示例
const router = new HistoryRouter()
router.register('/', () => {
  document.getElementById('app').innerHTML = '<h1>首页</h1>'
})
router.register('/about', () => {
  document.getElementById('app').innerHTML = '<h1>关于我们</h1>'
})

// 点击链接时阻止默认行为，使用push导航
document.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const path = link.getAttribute('href')
    router.push(path)
  })
})
/**
 * 1. 为什么会出现 404？
当用户在 SPA 的某个子页面（如https://example.com/about）点击刷新按钮时，浏览器会向服务器发起请求，请求/about这个路径的资源。但在 SPA 中，服务器上根本没有about.html这个文件，只有一个index.html，所以服务器会返回 404 错误。
解决方案
后端需要配置URL 重写规则，将所有请求都重定向到index.html，然后由客户端 JS 来解析路由并显示正确的内容。
   2. 自动上报SPA PV，可以改写history.pushState、history.replaceState、window popstate事件
 */

/**
 * react router
 * 1. 如果是直接打开/me页面
 * - nginx重写资源请求 /xxx 全部指向 /index.html 否则404
 * - react router 初始化读取history.pathname, 执行路由匹配到相应组件然后渲染
 * 2. 如果通过<Link to='/me' />点击跳转
 * - 点击<Link>后，React Router 会先调用history.pushState修改浏览器 URL 和历史栈，然后主动发布一个路由变化事件。BrowserRouter 监听到这个事件后更新内部的 location 状态，最终由<Routes>组件根据新的路径匹配并渲染对应的组件。
 * # 浏览器不会发生pushState和replaceState事件，需要react router自定义发送内部事件来监听path变化
 * 
 */