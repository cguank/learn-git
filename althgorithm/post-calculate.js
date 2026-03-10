const PriorityMap = {
  '*': 2,
  '/': 2,
  '+': 1,
  '-': 1,
  '(': 0,
}
function calculateStr(str) {
  const numStack = []
  const optStack = []
  const compute = () => {
    const b = numStack.pop()
    const a = numStack.pop()
    const opt = optStack.pop()
    let res = 0
    switch (opt) {
      case '+':
        res = a + b
        break
      case '-':
        res = a - b
        break
      case '*':
        res = a * b
        break
      case '/':
        res = Math.floor(a / b)
        break

      default:
        break
    }
    numStack.push(res)
  }
  for (let i = 0; i < str.length; i++) {
    const c = str[i]
    if (!isNaN(c)) {
      let num = 0
      while (i < str.length && !isNaN(str[i])) {
        num = num * 10 + Number(str[i])
        i++
      }
      numStack.push(num)
      i--
      continue
    }
    if (c === '(') {
      optStack.push(c)
      continue
    }
    if (c === ')') {
      while (optStack.at(-1) !== '(') {
        compute()
      }
      optStack.pop()
      continue
    }
    if (c === '-' && (i === 0 || str[i - 1] === '(')) {
      numStack.push(0)
    }
    while (optStack.length && PriorityMap[c] <= PriorityMap[optStack.at(-1)]) {
      compute()
    }
    optStack.push(c)
  }
  while (optStack.length) {
    compute()
  }
  return numStack[0]
}

console.log(calculateStr("1+2*3")); // 7
console.log(calculateStr("(1+2)*3")); // 9
console.log(calculateStr("100+200/2")); // 200
console.log(calculateStr("1*(-2)*3")); // -6
console.log(calculateStr("6*(5+2)-8/2")); // 38