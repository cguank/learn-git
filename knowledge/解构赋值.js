//有迭代器的都可以
let [x, y, z] = new Set([1, 4, 5])
    //默认值
let [x, y = 'b'] = [1, null]
let [x, y = 'b'] = [1, undefined]
//对象结构赋值
let obj = {
    name: '11',
    age: 122
}
let { name: age } = obj;
//嵌套结构赋值
let obj = {
    name: 'obj',
    age: 111,
    arr: {
        c: 'ccc',
        ar: [1, 2, 3]
    }
}
let { arr: dc, arr: { c: d, ar: [aa, bb] } } = obj

//对数组按对象方法结构赋值
let arr = [1, 2, 3];
let { 0: first, [arr.length - 1]: last } = arr;
first // 1
last // 3