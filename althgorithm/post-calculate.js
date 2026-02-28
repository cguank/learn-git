// 优先级
const priority = {
  '*': 2,
  '/': 2,
  '+': 1,
  '-': 1,
  '(': 0,
}
function operationCal (a,b,opt) {
  switch (opt) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    return 0
  }
}

function main (str) {
  let i = 0;
  const len = str.length
  // 数字栈、符号栈
  const result = [];
  const optStack = [];
  while (i < len) {
    // 取数字
    if (isFinite(str[i])) {
      let num = Number(str[i]);
      while (i + 1 < len && isFinite(str[i + 1])) {
        num = num * 10 + Number(str[i + 1])
        i++;
      }
      i++;
      result.push(num);
      continue
    }
    // 左括号
    if (str[i] === '(') {
      optStack.push(str[i++])
      continue
    }
    // 右括号
    if (str[i] === ')') {
      let char = optStack.pop();
      while (char!=='(') {
        result.push(char);
        char = optStack.pop();
      }
      i++
      continue;
    }
    // 比较opt优先级
    while (priority[optStack[optStack.length-1] ] >= priority[str[i]]) {
      result.push(optStack.pop())
    }
    optStack.push(str[i++])    
  }
  // 清空符号栈
  while (optStack.length) {
    result.push(optStack.pop())
  }
  return result;
}

function cal (postStr) {
  const result = [];
  for (const char of postStr) {
    if (isFinite(char)) {
      result.push(char)
      continue;
    }
    const b = result.pop();
    const a = result.pop();
    const rt = operationCal(a, b, char);
    result.push(rt);
  }
  return result[0];
}

const str1 = '3+5*(2-8+1)+5/1'
const postStr1 = main(str1)
console.log('postStr1',postStr1,cal(postStr1),eval(str1))  

const str2 = '10-2*6'
const postStr2 = main(str2)
console.log('postStr2',postStr2,cal(postStr2),eval(str2))  
