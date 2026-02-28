function format(str) {
  const parts = str.split('.')
  const part1 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return part1+'.'+parts[1]
}
const num1 = '123423232.112'
console.log(format(num1));
