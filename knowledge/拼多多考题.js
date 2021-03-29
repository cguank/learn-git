/**
let arr = [];
for (var i = 0; i < 10; i++) {
    var c = i;
    arr[i] = function() {
        console.log(c);

    }
}
console.log(c);
arr[6]()
 */

/**
 * protoype和__proto__的区别
 * 1.对象的__proto__指向它构造函数的原型，无prototype属性,找对象中不存在的属性和方法则通过__proto__查找，没找到返回null
 * 2.方法拥有prototype用于让该方法创建的实例共享prototype的属性和方法
 */

/**
 * a=null；
 * 怎么判断null，==可以吗，===可以吗
 *  concat是返回一个新数组而不是在原数组操作
 * /
//1
let a = null;
console.log(a === null, (!a && typeof a != "undefined" && a != 0));

///,
var x = 0,
    y = 1; {
    let x = 2,
        y = 2;
}
console.log(x, y);
//各种类型转换和数组
为bool时，会将bool转成数字,原始值总是将两边转成数字比较
console.log(false == undefined,"\n" == 0);
console.log(false == [])
console.log("" == [null],"" == [undefined])
console.log(+['1']);
console.log(+['1', '2', '3']);
console.log(+{});
console.log(new Date(2017, 04, 21) + 1)
console.log([] == ![])
console.log(100 + 'num', 100 + '100');
console.log(100 + true, 100 + false, 100 + null, Number(undefined));
if ([]) console.log(100);
console.log(isNaN(undefined), isNaN({}), isNaN([]), isNaN([1, 23]), isNaN("sdfsdf"));
let arr = [1, 2, 3, 4, 5]
console.log(Math.max(...arr), Math.max.call(Math, ...arr));
let str = '1999-1-1';
console.log(str.replace(/-/g, " "));
console.log(100 + {}, 100 + [], Number([]), [12, 3].toString())

//settiout
let obj = {
    get: 'obj',
    fn1: function() {
        let self = this;
        let ff = () => {
            console.log('in ff', this.get);

        }
        ff();
        setTimeout(function() { //形参为函数表达式的，该形参是定义在包含它的块级作用域内，此处就是obj.fn1
            console.log('in settimeout function this.get', this.get);
            console.log('in settimeout function self.get', self.get);

        }, 0);
        setTimeout(() => {
            console.log(this.get); //注意

            (function() {
                console.log(this.get);
                console.log(self.get);

            })()
        }, 0);
    },
    fn2: () => {
        console.log('fn2', this.get);

    }
}
obj.fn1()
obj.fn2()
**
*/
function foo() {
    function bar(a) {
        var i = 3;
        console.log(a + i);
    }
    for (var i = 0; i < 10; i++) {
        bar(i * 2);
    }
}
foo()

//
foo();
var a = true;
if (a) {
    function foo() {
        console.log(1);
    }
} else {
    function foo() {
        console.log(2);
    }
}

// pdd 多个请求尽可能快且按顺序打印
function geturl(urls) {
    const result = [];
    let count = 0;

    function process(index, data) {
        result[index] = data;
        for (let i = count; i < urls.length; i++) {
            if (result[i]) {
                count++;
                console.log(result[i]);
            } else {
                break;
            }
        }
    }
    urls.forEach((url, index) => {
        Axios.get(url).then(res => {
            process(index, res.data);

        }).catch(err => {
            process(index, err);
        })
    })
}