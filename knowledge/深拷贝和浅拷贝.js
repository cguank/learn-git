let arr = [1, 2, 3, [4, 5]];
let obj = {
    name: '123',
    age: 123,
    arr: arr,
    getName() {
        console.log(this.name);

    },
    isNull: null
};
/**
 * 浅拷贝实现
 */
//1.splice
let arr1 = arr.slice();
arr1[0] = 2;
arr1[3].push(3);
//2.es6 ...
arr1 = [...arr];
arr1[0] = 2;
arr1[3].push(3);

let obj1 = {...obj };
obj1.arr.push(5);
console.log(obj, obj1);


/*
 *
 * 深拷贝 */
//1.JSON 会让function之类的丢失，只能拷贝基本值
//2.递归
function deepCopy(target) {
    if (typeof target != "object") { //基本类型
        return target;
    }
    let rt = {};
    if (Array.isArray(target)) {
        rt = [];
    }
    for (let key of Object.keys(target)) {
        if (typeof target[key] === "object" && target[key] !== null) {
            if (target[key] == target) {
                rt[key] = rt;
            } else {
                rt[key] = deepCopy(target[key]);
            }
        } else {
            rt[key] = target[key];
        }
    }
    return rt;
}

/**
 * 完整拷贝一个对象obj，包括obj的原型
 * assign不能拷贝原型，将第一个参数之后的对象复制到第一个参数
 */
let clone = Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    obj
)

/**
 * 判断类型
 */
function mytype(val) {
    let str = Object.prototype.toString.call(val);
    return str.match(/^\[object\s(\w+)\]$/i)[1].toLowerCase();
}

/**
 * obj.hasOwnProperty(key)可以判断属性是否在对象上，原型链上的不算
 * key in obj 原型链上的也算进去
 */