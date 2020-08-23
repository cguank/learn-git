let arr = [1, 1, 11, 32, 32, 2, 2, 3, 4, 4];

/**
 * 1. es6 set
 */
let set = new Set(arr);
let newArr = [...set]
console.log(newArr);
/**
 * 2. Array.filter
 */
let arr = [1, 1, 11, 32, 32, 2, 2, 3, 4, 4];
let newArr = arr.filter((v, index) => arr.indexOf(v) == index)
console.log(newArr);
/**
 * 3. map法，不是很好，多创建了一个map占用空间
 */
let arr = [1, 1, 11, 32, 32, 2, 2, 3, 4, 4];

function clearRepeat(arr) {
    let map = new Map();
    let newArr = [];
    arr.forEach((v, i) => {
        if (!map.get(v)) {
            map.set(v, 1);
            newArr.push(v)
        }
    })
    return newArr
}
let newArr = clearRepeat(arr);
console.log(newArr);
/**
 * indexof
 */
let arr = [1, 1, 11, 32, 32, 2, 2, 3, 4, 4];

function clearRepeat(arr) {
    let rt = [];
    for (let item of arr) {
        if (rt.indexOf(item) == -1) rt.push(item);
    }
    return rt;
}
let newArr = clearRepeat(arr)
console.log(newArr);