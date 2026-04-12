const a = '1231'
const b = '555'

// 相减
function bigDecrease(a, b) {
  let isNegative = false
  if (b.length > a.length || (a.length === b.length && b > a)) {
    isNegative = true
    ;[a, b] = [b, a]
  }
  let borrow = 0
  let resArr = []
  let i = a.length - 1
  let j = b.length - 1
  while (i >= 0 || j >= 0) {
    const num1 = +(a[i--] || 0)
    const num2 = +(b[j--] || 0)
    let num = num1 - num2 - borrow
    if (num < 0) {
      borrow = 1
      num += 10
    } else {
      borrow = 0
    }
    resArr.push(num)
  }
  resArr = resArr.reverse()
  let k = 0
  while (k < resArr.length && resArr[k] === 0) {
    k++
  }
  const result = resArr.slice(k).join('')
  return isNegative ? '-' + result : result
}
console.log(bigDecrease(a, b))
