//https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md

/**
 function f1() {
    console.log(this);
    console.log(this.length);
}
let arr = [f1, 1, 2, 3];
arr[0]();
 */

/**
 * 查看输入顺序
 */
Promise.resolve().then(() => {
    console.log("promise1");
    setTimeout(() => {
        console.log("settimeout2");

    }, 0);
})

setTimeout(() => {
    console.log("settimeout1");
    Promise.resolve().then(() => {
        console.log("promise2");

    })

}, 0);
console.log("start");


//理解形参中的num和var num的区别，还有注意闭包作用域
var num = 20;
var obj = { //对象只是堆内存,不是作用域,想访问变量num,必须是obj.num的形式
    num: 30,
    fn: (function(num) {
            this.num *= 3;
            num += 15;
            var num = 45;
            return function() {
                this.num *= 4;
                num += 20;
                console.log(num)
            }
        })(num)
        //此处传参 是全局变量的num的值20 赋值给了自执行函数的形参 而不是obj的30 如果传入obj下的30 需要写成obj.num
}
var fn = obj.fn;
fn();
obj.fn();
console.log(num);
console.log(obj.num);

/**
 * 做错了，箭头函数
 */
//
const shape = {
    radius: 10,
    diameter() {
        return this.radius * 2
  },
    // 箭头函数不会创建自己的this，它只会捕获定义时外层作用域的this。
    // 在这里，perimeter 是用普通函数定义的，因此它的this指向 shape 对象。
    // perimeter 内部的箭头函数 (() => ...) 没有自己的 this，会继承 perimeter 执行时的 this，即 shape。
    // 这就是为什么箭头函数的 this 没有指向全局，而是 shape
    perimeter: function() {
        return (() => 2 * Math.PI * this.radius)()
    }
}
console.log(
    shape.diameter(),
    shape.perimeter());

//71. 如何能打印出console.log语句后注释掉的值？//做错n便
function* startGame() {
    const 答案 = yield "Do you love JavaScript?";
    if (答案 !== "Yes") {
        return "Oh wow... Guess we're gone here";
    }
    return "JavaScript loves you back ❤️";
}

const game = startGame();
console.log( /* 1 */ ); // Do you love JavaScript?
console.log( /* 2 */ ); // JavaScript loves you back ❤️

//做错了n便
var n = 123;

function f1() {
    console.log(n);
}

function f2() {
    console.log(n);
    var n = 456;
    f1();
    (() => {
        console.log(n);

    })();
}
f2()
console.log(n);


//第11题  构造函数
function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
}

const member = new Person("Lydia", "Hallie");
Person.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
}

console.log(member.getFullName());

//15  
function sum(a, b) {
    return a + b
}

console.log(sum(1, '2'));

//17  模板字符串
function getPersonInfo(one, two, three) {
    console.log(one)
    console.log(two)
    console.log(three)
}

const person = 'Lydia'
const age = 21

getPersonInfo `${person} is ${age} years old`

//19  //数组也是对象
function getAge(...args) {
    console.log(typeof args, args)
}

getAge(21)

//25 如果你有两个名称相同的键，则键会被替换掉。它仍然位于第一个键出现的位置，但是值是最后出现那个键的值。
const obj = { a: 'one', b: 'two', a: 'three' }
console.log(obj)

//29 当字符串化一个对象时，它会变成 "[object Object]"
const a = {}
const b = { key: 'b' }
const c = { key: 'c' }

a[b] = 123
a[c] = 456

console.log(a[b], b.toString())

//31
//当点击按钮时，event.target是什么？
// <
// div onclick = "console.log('first div')" >
//     <
//     div onclick = "console.log('second div')" >
//     <
//     button onclick = "console.log('button')" >
//     Click!
//     <
//     /button> <
//     /div> <
//     /div>

//35. 下面哪些值是 falsy?
0
new Number(0)
    ('')
    (' ')
new Boolean(false)
undefined

//37. 输出是什么？
const numbers = [1, 2, 3]
numbers[10] = 11
console.log(numbers, numbers[4])

//38.输出是什么？
(() => {
    let x, y
    try {
        throw new Error()
    } catch (x) {
        (x = 1), (y = 2)
        console.log(x)
    }
    console.log(x)
    console.log(y)
})()

//40. 输出是什么？
[[0, 1], [2, 3]].reduce(
    (acc, cur) => {
        console.log(acc, cur);

        return acc.concat(cur)
    }, [1, 2]
)

//46
let person = { name: "Lydia" };
const members = [person];
person = null;

console.log(members);

//47.
const person = {
    name: "Lydia",
    age: 21
};

for (const item in person) {
    console.log(item);
}

//49. num的值是什么?
const num = parseInt("7*6", 10);

//57. 输出是什么?
// counter.js
let counter = 10;
export default counter;
// index.js
import myCounter from "./counter";

myCounter += 1;

console.log(myCounter);

//58. 输出是什么?
const name = "Lydia";
age = 21;

console.log(delete name);
console.log(delete age);

//62. 输出是什么?
const settings = {
    username: "lydiahallie",
    level: 19,
    health: 90
};

const data = JSON.stringify(settings, ["level", "health"]);
console.log(data);

//65. 输出什么?
[1, 2, 3, 4].reduce((x, y) => console.log(x, y));



//72. 输出什么?
console.log(String.raw `Hello\nworld`);

//94. 输出什么?
function getItems(fruitList, ...args, favoriteFruit) {
    return [...fruitList, ...args, favoriteFruit]
}

getItems(["banana", "apple"], "pear", "orange")

//95. 输出什么?
function nums(a, b) {
    if (a > b)
        console.log('a is bigger')
    else
        console.log('b is bigger')
    return
    a + b
}
console.log(nums(1, 2));

//96. 输出什么?
class Person {
    constructor() {
        this.name = "Lydia"
    }
}

Person = class AnotherPerson {
    constructor() {
        this.name = "Sarah"
    }
}

const member = new Person()
console.log(member.name)

//97. 输出什么?
const info = {
    [Symbol('a')]: 'b'
}

console.log(info)
console.log(Object.keys(info))

//100. 输出什么?
// 🎉✨ This is my 100th question! ✨🎉

const output = `${[] && 'Im'}possible!
You should${'' && `n't`} see a therapist after so much JavaScript lol`

//101.输出什么?
const one = (false || {} || null)
const two = (null || false || "")
const three = ([] || 0 || true)

console.log(one, two, three)

//102. 依次输出什么?
const myPromise = () => Promise.resolve('I have resolved!')

function firstFunction () {
    myPromise().then(res => console.log(res))
    console.log('second')
}

async function secondFunction () {
    console.log(await myPromise())
    console.log('second')
}

firstFunction()
secondFunction()

//105. 输出什么?    //为什么const person变量提升了
function compareMembers (person1, person2 = person) {
    if (person1 !== person2) {
        console.log("Not the same!")
    } else {
        console.log("They are the same!")
    }
}

const person = { name: "Lydia" }

compareMembers(person)

//106. 输出什么?
const colorConfig = {
    red: true,
    blue: false,
    green: true,
    black: true,
    yellow: false,
}

const colors = ["pink", "red", "blue"]

console.log(colorConfig.colors[1])

//112. 输出什么？
function* generatorOne () {
    yield ['a', 'b', 'c'];
}

function* generatorTwo () {
    yield* ['a', 'b', 'c'];
}

const one = generatorOne()
const two = generatorTwo()

console.log(one.next().value)
console.log(two.next().value)

//114. 将会发生什么?
let config = {
    alert: setInterval(() => {
        console.log('Alert!')
    }, 1000)
}

config = null

//115. 哪一个方法会返回 'Hello world!' ？
const myMap = new Map()
const myFunc = () => 'greeting'

myMap.set(myFunc, 'Hello world!')

//1
myMap.get('greeting')
//2
myMap.get(myFunc)
//3
myMap.get(() => 'greeting')

//121. 输出什么?
const config = {
    languages: [],
    set language (lang) {
        return this.languages.push(lang);
    }
};

console.log(config.language);

//122. 输出什么？
const name = "Lydia Hallie";

console.log(!typeof name === "object");
console.log(!typeof name === "string");

//124. 输出什么？
async function* range (start, end) {
    for (let i = start; i <= end; i++) {
        yield Promise.resolve(i);
    }
}

(async () => {
    const gen = range(1, 3);
    for await (const item of gen) {
        console.log(item);
    }
})();

//125. 输出什么？
const myFunc = ({ x, y, z }) => {
    console.log(x, y, z);
};

myFunc(1, 2, 3);

//134. 我们怎样才能在 index.js 中调用 sum.js? 中的 sum？
// sum.js
export default function sum (x) {
    return x + x;
}

// index.js
import * as sum from "./sum";

//140. 选择哪一个？
const teams = [
    { name: "Team 1", members: ["Paul", "Lisa"] },
    { name: "Team 2", members: ["Laura", "Tim"] }
];

function* getMembers (members) {
    for (let i = 0; i < members.length; i++) {
        yield members[i];
    }
}

function* getTeams (teams) {
    for (let i = 0; i < teams.length; i++) {
        // ✨ SOMETHING IS MISSING HERE ✨
    }
}

const obj = getTeams(teams);
obj.next(); // { value: "Paul", done: false }
obj.next(); // { value: "Lisa", done: false }


//144. 我们需要向对象 person 添加什么，以致执行 [...person] 时获得形如 ["Lydia Hallie", 21] 的输出？
const person = {
    name: "Lydia Hallie",
    age: 21
}

[...person] // ["Lydia Hallie", 21]