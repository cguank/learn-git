// 1249删除无效括号

// 239优先级队列无法处理时序问题，所以要用单调队列 
// 有窗口、按顺序过期 → 单调队列
// 随便加、随时挑最大最小 → 优先队列 

class DecreaseQue {
  constructor() {
    this.que = []
    this.decreaseque = []
    this.size=0
  }
  push (x) {
    this.que.push(x)
    this.size++
    while (this.decreaseque.length && x>this.decreaseque.at(-1)) {
      this.decreaseque.pop()
    }
    this.decreaseque.push(x)
  }
  pop () {
    if (this.size === 0) return null;
    const res = this.decreaseque[0];
    const first = this.que.shift()
    if (first === this.decreaseque[0]) this.decreaseque.shift()
    this.size--
    return res
  }
}