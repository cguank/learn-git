class MinHeap {
  constructor() {
    this.arr = [-1]
    this.size = 0
  }
  enqueue(num) {
    this.arr[++this.size] = num
    this.swim(this.size)
  }
  parent(index) {
    return Math.floor(index / 2)
  }
  swap(a, b) {
    ;[this.arr[a], this.arr[b]] = [this.arr[b], this.arr[a]]
  }
  swim(index) {
    let parent = this.parent(index)
    while (parent && parent !== index && this.arr[parent] > this.arr[index]) {
      this.swap(parent, index)
      index = parent
      parent = this.parent(index)
    }
  }
  getLeft(index) {
    return index * 2
  }
  getRight(index) {
    return index * 2 + 1
  }
  sink(index) {
    while (index <= this.size) {
      const left = this.getLeft(index)
      let minIndex = index
      if (left <= this.size && this.arr[minIndex] > this.arr[left]) {
        minIndex = left
      }
      const right = this.getRight(index)
      if (right <= this.size && this.arr[minIndex] > this.arr[right]) {
        minIndex = right
      }
      if (minIndex === index) break
      this.swap(minIndex, index)
      index = minIndex
    }
  }
  dequeue() {
    const res = this.arr[1]
    this.swap(1, this.size)
    this.size--
    this.sink(1)
    return res
  }
  peek() {
    if (!this.size) return null
    return this.arr[1]
  }
}

function main(arr, k) {
  const res = []
  const minque = new MinHeap()
  for (let i = 0; i < arr.length; i++) {
    minque.enqueue(arr[i])
    console.log('enque', arr[i])

    if (minque.size > k) {
      const a = minque.dequeue()
      console.log('====', a)
    }
    if (minque.size === k) res.push(minque.peek())
  }
  return res
}

const arr = [3, 2, 4, 5, 1]
const k = 5
console.log(main(arr, k))

const minque = new MinHeap()
arr.forEach((item) => {
  minque.enqueue(item)
})

while (minque.size) {
  console.log(minque.dequeue())
}
