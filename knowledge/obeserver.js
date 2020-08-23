class Observer {
    constructor(name) { //subject被观察者
        this.name = name;
        this.subject = {};
    }
    listen(subject) {
        this.subject = subject;
        subject.observers.push(this);
    }
    update() {
        console.log(this.name, 'observed subject:', this.subject.name, 'level has changed: ', this.subject.level);
    }
}

class Subject {
    constructor(name, level) {
        this.name = name;
        this.level = level;
        this.observers = [];
    }
    notifyObservers() {
        this.observers.forEach(item => {
            item.update()
        })
    }

    setLevel(value) {
        console.log(`level has changed ${this.level} to ${value}`);
        this.level = value;
        this.notifyObservers();
    }

}

let sub1 = new Subject('sub1', 0);
let ob1 = new Observer('ob1');
let ob2 = new Observer('ob2');
ob1.listen(sub1);
ob2.listen(sub1);
sub1.setLevel(1)
sub1.setLevel(2)

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