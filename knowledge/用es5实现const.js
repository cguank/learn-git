/**es5实现const，只读的属性 */
function _const(key, value) {
    global[key] = value;
    Object.defineProperty(global, key, {
        enumerable: false,
        configurable: false,
        get: function() { return value },
        set: function(v) {
            throw new Error('bukegenggai');

        }
    })
}
_const("aa", 111);
//_const("aa", 123);
//aa = 123
_const("obj", { name: '1222' })
obj.age = '11111';
obj.age = 123
obj = {}
console.log(aa, obj)

/**let主要是块级作用域用闭包解决，无法实现无变量提升 */
((range) => {
    for (var i = 0; i < range; i++) {
        ((v) => {
            setTimeout(() => {
                console.log(v);

            }, 0);
        })(i)
    }

})(5);
console.log(i);