let arr = [1, 2, [3, [4, [5]]],
    [6]
];
/**
 * 第一种，在浏览器下能执行
 */
let rt;
//rt = arr.flat(Infinity);

/**
 * 第二种，正则替换执行
 */
rt = JSON.stringify(arr);
rt = rt.replace(/(\[|\])/g, '');
rt = '[' + rt + ']';
rt = JSON.parse(rt);

/**
 * 第三中，递归
 */
rt = [];

function flat(arr) {
    for (let item of arr) {
        if (Array.isArray(item)) flat(item);
        else rt.push(item);
    }
}
flat(arr);

/**
 * 第四种 reduce
 */
function flatReduce(arr) {
    return arr.reduce((rt, cur) => {
        return rt.concat(Array.isArray(cur) ? flatReduce(cur) : cur);
    }, [])
}
rt = flatReduce(arr);

/**
 * 带参数+挂载，注意this
 */
Array.prototype.flat = function(depth = 1, arr = this) {
    if (depth == 0) {
        return [].concat(arr);
    } else {
        return arr.reduce((rt, cur) => {
            if (Array.isArray(cur)) {
                return rt.concat(cur.flat(depth - 1));
            } else {
                return rt.concat(cur);
            }
        }, [])
    }
}
let arr = [1, 2, 3, 4, [2, 3, 4, [5, 6]],
    [5, 7],
    [1, [2, [3]]]
];
let a = arr.flat(2);
let b = arr.flat(Infinity)
let c = arr.flat(0);
let d = arr.flat()
console.log(c);
console.log(d);
console.log(a);
console.log(b);

/**
 * 另一种做法，引入一个相当于全局变量的rt，这时就不需要声明一个全局变量了
 */
Array.prototype.flat = function(depth = 1, rt = []) {
    if (depth === 0) {
        rt.push(...this);
    } else {
        for (let item of this) {
            if (Array.isArray(item)) {
                item.flat(depth - 1, rt);
            } else {
                rt.push(item);
            }
        }
    }
    return rt;
}