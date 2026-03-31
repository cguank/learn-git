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


/**
 * 原型链继承会造成引用类型被不同实例篡改，所以引入组合继承；
 * 但组合继承会让实例和原型都存在父类属性，产生冗余；
 * 所以又引入寄生组合继承，
 * 让实例拥有独立父属性，原型只继承父类原型方法，既隔离又无多余冗余。
 */


function SuperType (name) {
  this.name = name;
  this.colors = ['red']
}
SuperType.prototype.sayName = function () {
  console.log(this.name);
}


// 原型链继承开始
// function SubType(name, age) {
//   this.name = name
//   this.age = age
// }
// SubType.prototype = new SuperType();
// 原型链继承结束

// 组合继承开始
// function SubType (name, age) {
//   SuperType.call(this, name);
//   this.age = age;
// }
// SubType.prototype = new SuperType();
// 组合继承结束

// 寄生组合继承开始
function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age
}
function inHerit (subtype, supertype) {
  const prototype = Object.create(supertype.prototype);
  prototype.constructor = subtype;
  subtype.prototype=prototype
}
inHerit(SubType, SuperType)
// 寄生组合继承结束

const s1 = new SubType('s1',1)
const s2 = new SubType('s2', 2)
s1.sayName()
s2.sayName()
s1.colors.push('bb')
console.log(s1,s2);
console.log(s1.__proto__);
console.log(s1.__proto__.__proto__);
console.log(s1.__proto__.__proto__.__proto__);


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