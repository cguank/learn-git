const {
  clearInterval
} = require("timers");

// 1.
window.scrollTo({
  top: xxx,
  behavior: 'smooth'
})

// 2. js
function ScrollTop(number, during) {
  if (!during) {
    document.documentElement.scrollTop = number;
    return;
  }
  // 定义循环间隔时间，越小耗时越大
  const spacingTime = 20;
  // 循环多少次
  let intervalCount = Math.ceil(during / spacingTime);
  // 当前位置
  let nowTop = document.documentElement.scrollTop;
  // 每次移动多少距离
  let everDistance = (number - nowTop) / intervalCount;
  let timer = setInterval(() => {
    if (intervalCount) {
      ScrollTop(nowTop += everDistance);
      intervalCount--;
    } else clearInterval(timer);
  }, spacingTime);
}