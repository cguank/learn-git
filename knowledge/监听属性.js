let obj = { name: '123' }
    //调用闭包来实现，不能直接使用key不然会死循环
function oberser(obj, key) {
    let _key = undefined;
    Object.defineProperty(obj, key, {
        enumerable: true,
        set: function(v) {
            console.log("监听到了", v);
            _key = v;

        },
        get() {
            console.log("监听到了get");
            return _key;
        }
    })
}
oberser(obj, "name");
console.log(obj.name);
obj.name = 1231241124;
console.log(obj.name);
console.log(obj);

/**
 * proxy
 */
let obj1 = new Proxy({}, {
    get(target, key) {
        console.log("get", key, target[key], this);
        return target[key]
    },
    set(target, key, v) {
        console.log("set", key);
        target[key] = v;

    }
})
obj1.name = "sfdsfsdfs"
obj1.age = 0;
obj1.age++
    console.log(obj1.name);