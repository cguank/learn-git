class UF {
  constructor(n) {
    this.parent = []
    this.sizes = []
    for (let i = 1; i <= n; i++) {
      this.parent[i] = i
      this.sizes[i] = 1
    }
  }
  find(x) {
    if (x === this.parent[x]) return x
    const root = this.find(this.parent[x])
    this.parent[x] = root
    return root
  }
  connect(a, b) {
    const pa = this.find(a)
    const pb = this.find(b)
    if (pa === pb) return
    this.parent[pa] = pb
    this.sizes[pb] += this.sizes[pa]
  }
}
