/**
 * 
 * 生成[0,n-1]的随机数，且不重复生成
 * 思想：
 * 其实就是利用数组下标来处理，每生成一个元素，数组长度就减一
 * 假设第一次生成num
 * 则将arr[num]打印，并将数组arr[num]=arr[end]，并且end--，进入下一次循环
 */
function getRandomArr(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(i);
  }
  const output = [];
  let end = n - 1;
  for (let i = 0; i < n; i++) {
    const num = parseInt(Math.random() * (end + 1), 10);
    output[i] = arr[num];
    arr[num] = arr[end--]
  }
  console.log(output);
}
getRandomArr(10)