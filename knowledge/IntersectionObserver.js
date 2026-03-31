// 图片懒加载
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      observer.unobserve(img) // 加载完取消监听
    }
  })
})

document.querySelectorAll('.lazy').forEach((img) => {
  observer.observe(img)
})




class MyIntersectionObserver {
  constructor(callback, options = {}) {
    // 回调函数
    this.callback = callback
    // 配置项
    this.root = options.root || null // 监听根节点（视口/null）
    this.rootMargin = options.rootMargin || '0px'
    this.threshold = options.threshold || 0

    // 存储所有被监听的 DOM
    this.observers = []

    // 绑定 scroll 事件（节流）
    this.check = this.throttle(this.check.bind(this))
    window.addEventListener('scroll', this.check)
  }

  // 核心：检查元素是否进入视口
  check() {
    this.observers.forEach((target) => {
      // 获取元素位置
      const rect = target.getBoundingClientRect()
      const rootRect = this.root
        ? this.root.getBoundingClientRect()
        : { top: 0, left: 0, bottom: innerHeight, right: innerWidth }

      // 判断是否交叉
      const isIntersecting =
        rect.bottom >= rootRect.top &&
        rect.top <= rootRect.bottom &&
        rect.right >= rootRect.left &&
        rect.left <= rootRect.right

      // 触发回调
      this.callback([
        {
          isIntersecting,
          target,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: rect,
        },
      ])
    })
  }

  // 监听元素
  observe(target) {
    this.observers.push(target)
    this.check() // 立即执行一次
  }

  // 取消监听
  unobserve(target) {
    this.observers = this.observers.filter((item) => item !== target)
  }

  // 销毁
  disconnect() {
    window.removeEventListener('scroll', this.check)
    this.observers = []
  }

  // 节流（必须写，面试加分）
  throttle(fn, delay = 100) {
    let last = 0
    return (...args) => {
      const now = Date.now()
      if (now - last >= delay) {
        last = now
        fn(...args)
      }
    }
  }
}