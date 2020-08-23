/**
 * 
Object.defineProperty()缺陷
1.无法监听数组的变化
2.对象添加删除属性无法监听
 */

/**
 * 交换a,b的值
 * 1.a=a+b;b=a-b;a=a-b;
 * 2.a=[a,b];b=a[0];a=a[1](数组换成对象也行);
 * 3.a ^= b;b ^= a;a ^= b;
 */

/**
 * ['1','2','3'].map(parseInt)
 * map有3个值：val,index,arr;
 * 则会传入（'1',0）,('2',1),('3',2);
 * 0默认为10进制，结果[1,NAN,NAN];
 */

/**
 * 闭包：能够访问另一个函数作用域中的变量的函数
 * 用途：1.能够访问另一个函数作用域中的变量。2.令已经运行结束的函数的变量对象保存再内存中，因为闭包的作用域链中保存了对这个变量对象的引用
 * 缺点：使用不当会内存泄漏
 * function aa() {
 *  let dom = document.queselefctr("#ccc");
 *  return function () {
 *      console.log(dom.id);
 * }
 * }
 */

/**
 const对象为什么能添加属性
 修改对象属性不会改变对象指针的指向
 */

/**
 * 为什么js是单线程的还能执行回调函数（主线程>微任务（promise）>宏任务（settimeout，事件click等），其中当前宏任务包含微任务，会先执行完正在执行的红任务）
 * 1.首先js分为主线程和任务队列,异步函数由另一个线程执行
 * 2.所有同步任务都在主线程中执行，异步任务有了结果后放入任务队列
 * 3.主线程执行完后，会读取任务队列并执行
 */


//原型链继承问题：父类有引用对象属性，在实例A中需改该属性，实例B也会受影响，比如数组
//理解封装，继承，多态

function superType(name, age) {
    this.name = name;
    this.age = age;
    this.colors = [1, 2, 3];
}
superType.prototype.getSuper = function() {
    console.log('super');
}

function subType(name, age, level) {

    superType.apply(this, arguments);
    this.age = age;
}

//组合继承开始
//subType.prototype = new superType();
//subType.prototype.constructor=subType
//组合继承结束

//寄生组合继承开始
function inherit(superType, subType) {
    let prototype = Object.create(superType.prototype);
    prototype.construtor = subType;
    subType.prototype = prototype;
    subType.__proto__ = superType //es6继承比寄生组合继承多了这一项
}
inherit(superType, subType);
subType.prototype.sayAge = function() {
        console.log(this.age);

    }
    //寄生组合继承结束


let a1 = new subType('a1', 1, 1);
a1.getSuper()
a1.colors.push(22);
let a2 = new subType('a2', 2, 2);
console.log(a1.__proto__, a1, a2);

/**
 * es6 写法
 */
class Animal {
    constructor(name) {
        this.name = name;
    }
    run() {
        console.log('animal is running');

    }
    runAll() {
        this.run();
    }
}

class Dog extends Animal {
    constructor(name, age) {
        super(...arguments);
        this.age = age;
    }
    run() {
        console.log('dog isrunnig');

    }
}

let dog = new Dog('dog', 1);
dog.runAll()