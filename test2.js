let weight = {
    //第一个代表扫描的，第二个代表栈中的权重，
    //权重高可进展，否则出栈
    '+': [2, 3],
    '-': [2, 3],
    '*': [4, 5],
    '/': [4, 5],
    '(': [6, 1],
    ')': [1, 6],
    '#': [0, 0],
}

function getPostExp(arr) {
    arr += '#';
    const result = [];
    const operators = ['#'];
    let curStr = '';
    for (let item of arr) {
        if (!isNaN(item)) {
            curStr += item;
            continue;
        }
        if (curStr) {
            result.push(+curStr);
            curStr = '';
        }
        do {
            let topValue = operators[operators.length - 1];
            if (!topValue) {
                operators.push(item);
                break;
            } else if (weight[topValue][1] < weight[item][0]) {
                operators.push(item);
                break;
            } else if (weight[topValue][1] === weight[item][0]) {
                operators.pop();
                break;
            } else {
                result.push(topValue);
                operators.pop();
            }
        } while (true);

    }
    return result;
}
/**
 * @param {string[]} tokens
 * @return {number}
 */
function operation(num1, num2, operator) {
    let newNum = 0;
    switch (operator) {
        case '+':
            newNum = parseInt(+num1 + (+num2));
            break;
        case '-':
            newNum = parseInt(+num1 - (+num2));
            break;
        case '*':
            newNum = parseInt(+num1 * (+num2));
            break;
        case '/':
            newNum = parseInt(+num1 / (+num2))
        default:
            break;
    }
    return newNum;
}
var evalRPN = function(tokens) {
    let stack = [];
    for (let item of tokens) {
        if (!isNaN(item)) {
            stack.push(item);
        } else {
            let num1 = stack.pop();
            let num2 = stack.pop();
            let newNum = operation(num2, num1, item);
            stack.push(newNum);
        }
    }
    return stack.pop();
};
let arr = '5-2*3+(1-2*3)'
console.log(getPostExp(arr));
console.log(evalRPN(getPostExp(arr)));