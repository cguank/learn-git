function curry(fn, ...args) { //只能处理一次
    return function() {
        return fn.apply(this, args.concat(...arguments))
    }
}

/**
 * 
递归处理，把多个参数转成1个
 */
function processCurry(fn, ...args) {
    return function() {
        let finalArgs = args.concat(...arguments);
        if (fn.length <= finalArgs.length) //fn.length可以得出该函数有几个形参
            return fn.apply(this, finalArgs);
        else return processCurry(fn, ...finalArgs)
    }
}

/**
 * lazyman
 */
class LazyMan {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.tasks = [];
        this.getName();
        setTimeout(() => {
            this.next()
        }, 0);
    }
    next() {
        let fn = this.tasks.shift();
        fn && fn();
    }
    getName() {
        let fn = () => {
            console.log(this.name);
            this.next();
        }
        this.tasks.push(fn);
        // setTimeout(() => {
        //     this.next();
        // }, 0);
        return this;
    }
    getAge() {
        let fn = () => {
            console.log(this.age);
            this.next();
        }
        this.tasks.push(fn);
        // setTimeout(() => {
        //     this.next();
        // }, 0);
        return this;
    }
    sleepFirst(wait) {
        let fn = () => {
            setTimeout(() => {
                console.log('wake up after ', wait);
                this.next();
            }, wait);
        }
        this.tasks.unshift(fn);
    }
    sleep(wait) {
        let fn = () => {
            setTimeout(() => {
                console.log('wake up after ', wait);
                this.next();
            }, wait);
        }
        this.tasks.push(fn);
        // setTimeout(() => {
        //     console.log('wake up after ', wait);
        //     this.next();
        // }, wait);
        return this;
    }
}

function newLazyMan(name, age) {
    return new LazyMan(name, age);
}
let a = newLazyMan('hank', 11).getAge().getName().sleep(1000).sleepFirst(3000)