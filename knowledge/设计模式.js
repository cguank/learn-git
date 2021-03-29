// 观察者模式
class Subject {
    constructor() {
        this.observerArr = [];
    }
    addObserver(observer) {
        this.observerArr.push(observer);
    }
    deleteObserver(observer) {
        const index = this.observerArr.indexOf(observer);
        if (index !== -1) {
            this.observerArr.splice(index, 1);
        }
    }
    notifyObservers() {
        this.observerArr.forEach(item => {
            item.update();
        })
    }
}
class Observer {
    constructor(name) {
        this.name = name;
    }
    update() {
        console.log('收到通知了', this.name);
    }
}

// 订阅发布模式
class PublishHub {
    constructor() {
        this.arr = [];
    }
    subscribe(type, fn) {
        if (this.arr[type]) {
            if (this.arr[type].indexOf(fn) === -1) {
                this.arr[type].push(fn);
            }
        } else {
            this.arr[type] = [fn];
        }
    }
    unSubscribe(type, fn) {
        if (this.arr[type]) {
            const index = this.arr[type].indexOf(fn);
            if (index !== -1) {
                this.arr[type].splice(index, 1);
            }
        }
    }
    publish(type, ...args) {
        this.arr[type].forEach(fn => {
            fn.apply(this, args);
        });
    }
}

/**
 * 单例模式，通过闭包完成
 */
let Head = (function() {
    let instance;
    return function(name, age) {
        if (instance) {
            return instance;
        }
        this.name = name;
        this.age = age;
        instance = this;

        return instance;
    }
})();
let a1 = new Head("a1", 13);
let a2 = new Head("a2", 14);
console.log(a1, a2, a1 === a2);

/**
 * 工厂模式
 */
function shapeFactory(type) {
    if (this instanceof shapeFactory) {
        return new this[type]();
    } else {
        return new shapeFactory(type);
    }

}
shapeFactory.prototype = {
    circle: function() {
        this.name = 'circle';
    },
    triangle: function() {
        this.name = 'triangle';
    }
}
let a = new shapeFactory("circle");