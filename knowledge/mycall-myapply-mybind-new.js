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
Function.prototype.mycall = function(ctx) {
    ctx.fn = this;
    let args = [...arguments].slice(1);
    let result = ctx.fn(...args);
    delete ctx.fn;
    return result;
}

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
    let _this = this;
    let fBound = function() {
        _this.apply(this instanceof fBound ? this : context, args.concat(...arguments));
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
        if (now - pre > 0) {
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