// 如何获取对象的symbol keys, getOwnPropertySymbols
// forin 会返回所有可枚举key包括原型链上的，不包括symbol；object.keys不会返回原型链上的keys；getOwnPropertyNames返回所有可枚举不可枚举的keys，但也不会返回symbol

/**
 * webpack生命周期/钩子
 * https://blog.csdn.net/qq_17335549/article/details/137561075
 * 初始化阶段 -> 编译阶段:before-run -> 构建阶段:compilation -> 优化阶段:optimize/processAssets -> 产出阶段:emit -> 完成阶段:completion
 * WebpackManifestPlugin在processAssets钩子执行
 * ImageMinimizerPlugin在processAssets阶段执行
 */
// webpack常见的plugin https://blog.csdn.net/qq_17335549/article/details/135854098

// ReactNative 0.63解决安卓16kb问题 - native配置启用hermes引擎

// this的指向
class AA {
  name = 'name'
  sayName1() {
    console.log(this.name)
  }
  sayName2 = () => {
    console.log(this.name)
  }
}
const a = new AA()
const sayName1 = a.sayName1
const sayName2 = a.sayName2
// sayName1() // 报错，class是严格模式，this指向undefined
sayName2() // name, 箭头函数会指向类的实例

const obj = {
  count: 10,
  doSomethingLater () {
    // settimeout里改成箭头函数即可
    setTimeout(function () {
      // 此函数在 window 作用域下执行
      this.count++;
      console.log(this.count);
    }, 300);

    // 普通函数看有没有左边的那个对象，没有则是全局对象
    ;(function () {
      // 此函数在 window 作用域下执行
      this.count++
      console.log(this.count) // 输出“NaN”，因为“count”属性不在
    })()
  },
};

obj.doSomethingLater(); // 输出“NaN”，因为“count”属性不在 window 作用域下。

// reduce reduce 传的是「上一次的返回值」。
const array = [1, 2, 3]
const getRandom = () => Promise.resolve(Math.random())
// async 的返回值一定是 Promise，所以下一轮的 acc 往往是 Promise
const sum = array.reduce(async (acc, pre) => {
  const random = await getRandom();
  const finalAcc = await acc;
  return finalAcc+random+pre
},0)
sum.then(r => {
  console.log(r);
})
