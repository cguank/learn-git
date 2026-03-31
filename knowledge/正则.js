function format(str) {
  const parts = str.split('.')
  // (?!\d) 是负向前瞻，表示只匹配后面不是数字的位置。
  // 在这个正则里：/\B(?=(\d{3})+(?!\d))/g
  // 例如 "1234567"：
  // - \B 意味着不是单词边界，这样不会在数字开头加逗号，
  // - (?=(\d{3})+(?!\d)) 表示当前这个位置（不是开头）后面有若干组3个数字，而且这些3个数字后面不能是其它数字（否则会错把4位数末尾也加了逗号）。
  // 例如对于 "1234567"：
  // 7 前面有 3 位（567），继续前面再有 3 位（234），这种位置需要加逗号，结果 "1,234,567"
  // 如果不用 (?!\d) 约束，像 "12345" 也会把 "1,234" 变成 "1,2,345"，就错了。
  // 比如12345，不带上的话会匹配 345，也会匹配234
  // 是的，正则的 replace 方法会先找到所有匹配的位置（全局匹配 /g），
  // 然后再统一进行替换（即先确定所有要替换的位置，再依次替换，不会边替边影响后面的匹配位置）。
  // 例如 '1234567'.replace(/\B(?=(\d{3})+(?!\d))/g, ',')，会提前把所有该加逗号的位置找出来再加。
  const part1 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return part1 + '.' + parts[1]
}
const num1 = '12345'
console.log(format(num1))

function mySplit(str, sep) {
  const res = []
  let start = 0
  const len = sep.length

  for (let i = 0; i <= str.length - len; i++) {
    if (str.slice(i, i + len) === sep) {
      res.push(str.slice(start, i))
      start = i + len
      i = start - 1
    }
  }
  res.push(str.slice(start))
  return res
}