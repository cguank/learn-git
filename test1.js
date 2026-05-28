const obj = {
  a: 1,
  fn() {
    return () => console.log(this.a)
  },
}
obj.fn()() // 1
