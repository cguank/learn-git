var name = 'window';
var obj = {
    name: 'obj',
    fn: function(v1, v2) {
        console.log(this.name);
        return v1 + v2;
    }
}
var obj1 = {
    name: 'obj11111'
}
Function.prototype.mycall = function (ctx) {
  ctx = ctx || window
    ctx.fn = this;
  let args = [...arguments].slice(1);
    // 这里不能直接用this，是因为在Function.prototype.mycall方法内部，this指向的是调用mycall的那个函数本身，
    // 而不是希望作为调用上下文的ctx对象。我们需要把这个函数（即this）挂在ctx上，以便通过ctx.fn调用时，this指向ctx。
  // 如果直接用this()，this仍指向原函数的执行上下文，并不会改变this指向。
  
  let result = ctx.fn(...args);
  
    delete ctx.fn;
    return result;
}
console.log(obj.fn.mycall(obj1, 1, 2))


Function.prototype.myapply = function(ctx) {
    ctx.fn = this;
    let args = arguments[1];
    let result = ctx.fn(...args);
    delete ctx.fn;
    return result;
}

//绑定bind的函数，用作new，context失效，this指向新对象
Function.prototype.myBind = function(context, ...args) {
    if (typeof this != "function") {
        throw new Error("非函数");
    }
  const self = this;
    /**
     * 这样写（即在bind实现中用闭包返回一个新函数、通过this instanceof fBound判断是作为构造器还是普通调用、以及复制原型链）
     * 有几个原因：
     * 
     * 1. bind需要返回一个新函数而不是直接调用：
     *    bind的特性就是不会马上调用原函数，而是返回一个绑定了this的新函数，方便以后多次调用或传递。
     * 
     * 2. this instanceof fBound用于new操作兼容：
     *    如果用bind返回的函数作为构造函数(new fBound)，那么绑定的this应该是新创建的实例对象（即this），而不是bind的context。
     *    检查this是否为fBound的实例，可以知道当前new了fBound，这时应该忽略context，用this作为执行上下文。
     * 
     * 3. 原型链继承：
     *    手动处理fBound.prototype = Object.create(this.prototype)可以让bind返回的新函数作为构造器创建的实例对象依然继承原函数（目标函数）的原型属性。
     *    否则用bind后用new出来的对象，原型链会丢失。
     * 
     * 总结：这样写可以兼容bind的全部特性（绑定this、预置参数、支持new操作且原型链正确）。
     */
    const fBound = function () {
        return self.apply(this instanceof fBound ?
            this: context, args.concat(...arguments)
        );
    }
    fBound.prototype = Object.create(this.prototype);
    /**
     *  Object.create(this.prototype);
     *  即Object.create=function (o) {
     *      let fn = function () {};
     *      fn.prototype = o;
     *      return new fn();
     * }
     */
    return fBound;
}


function objectFactory(ctor, ...args) {
    let obj = {};
    obj.__proto__ = ctor.prototype;
    let rt = ctor.apply(obj, args);
    let isObj = typeof rt === "object" && rt != null;
    let isFun = typeof rt === "function";
    return isObj || isFun ? rt : obj;
}

function myInstanceof(left, right) { //用来检测右边的原型是否出现在左边的原型链上
    while (left.__proto__ != null && left.__proto__ != right.prototype) {
        left = left.__proto__;
    }
    if (left.__proto__ != null) {
        return true;
    } else {
        return false;
    }
}

function debounce(fn, wait, immediate) { //是否立即执行
    let timer = null;
    return function() {
        if (immediate) { //立即执行
            if (timer) {
                clearTimeout(timer);
            }
            let callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, wait);
            if (callNow) {
                fn.apply(this, arguments);
            }
        } else {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn.apply(this, arguments);
            }, wait);
        }
    }

}

function debounce(fn, wait) { //可以取消，即可马上执行回调
    let timer = null;
    let debounced = function() {
        if (timer) {
            clearTimeout(timer);
        }
        let callNow = !timer;
        timer = setTimeout(() => {
            timer = null;
        }, wait);
        if (callNow) {
            fn.apply(this, arguments);
        }
    }
    debounced.cancel = function() {
        clearTimeout(timer); //不加这句，取消后仍执行；
        timer = null;
    }
}

function throttle(fn, wait) { //最后一次总会执行
    let pre = 0;
    let timer = null;
    return function() {
        let now = Date.now();
        if (now - pre > wait) {
            fn.apply(this, arguments);
            pre = now;
            //清空timer，并让timer能触发
            timer = null;
            clearTimeout(timer);
        } else if (!timer) {
            timer = setTimeout(() => {
                timer = null; //不加这个的化，最后一次执行后，马上调用一次，若在时间内则不会触发，即最后一次无法触发
                fn.apply(this, arguments);
                pre = Date.now() //不加这个的化，最后一次执行后，若再次触发则会马上执行
            }, wait);
        }
    }
}

/**
 * this
 * 1.显示绑定
 * apply,call,bind
 * 2.隐式绑定
 * 通过对象进行调用
 * 3.new改变this的指向，还有箭头函数
 */