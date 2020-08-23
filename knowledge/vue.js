/**
 * beforecreated中computed和props是访问不到的
 */

/**
 * vue监听不到的情况
 * 数组：1.通过索引改值;2.直接修改数组的长度
 * 对象：增加删除属性
 * 
 * Object.defineProperty的缺点
 * 1.无法监听数组的长度变化，对按照索引新添加的值无法监听(可以通过遍历对每个索引劫持，但是之后索引再发生变化没有手动调用劫持函数则无法劫持，且索引很长则要浪费长时间遍历，所以只对push splice等方法劫持)
 * 2.只能劫持对象的属性，无法劫持对象
 */

/**
 * vue怎么监听数组
 * 1.建立一个新原型指向数组的原型（arraymethods=Obeject.create(Array.prototype)）
 * 2.在这个原型上对push、pop、reverse、unshift、shift、splice、sort重写，主要就是执行一遍
 * 数组的原始方法，执行完毕后通知订阅器进行更新
 * 3.其中还会检测浏览器是否支持__proto__，支持就让实例的proto指向新原型，否则在这个实例上定义重写的方法
 */
let arr = []
Object.defineProperty(arr, 'push', {
    enumerable: false,
    configurable: true,
    value: function(...args) {
        console.log("push");
        Array.prototype.push.apply(this, args);
        //let rt = Array.prototype.push.apply(this, args);
        //return rt;
    }
})
console.log(arr.push([123, 4], 4), arr);

/**
 * 「Virtual Dom 的优势」其实这道题目面试官更想听到的答案不是上来就说「直接操作/频繁操作 DOM 的性能差」，如果DOM操作的性能如此不堪，那么 jQuery 也不至于活到今天。所以面试官更想听到 VDOM 想解决的问题以及为什么频繁的 DOM 操作会性能差。

首先我们需要知道：

DOM 引擎、JS 引擎 相互独立，但又工作在同一线程（主线程）
JS 代码调用 DOM API 必须 挂起 JS 引擎、转换传入参数数据、激活 DOM 引擎，DOM 重绘后再转换可能有的返回值，最后激活 JS 引擎并继续执行若有频繁的 DOM API 调用，且浏览器厂商不做“批量处理”优化，
引擎间切换的单位代价将迅速积累若其中有强制重绘的 DOM API 调用，重新计算布局、重新绘制图像会引起更大的性能消耗。
其次是 VDOM 和真实 DOM 的区别和优化：

虚拟 DOM 不会立马进行排版与重绘操作
虚拟 DOM 进行频繁修改，然后一次性比较并修改真实 DOM 中需要改的部分，最后在真实 DOM 中进行排版与重绘，减少过多DOM节点排版与重绘损耗
虚拟 DOM 有效降低大面积真实 DOM 的重绘与排版，因为最终与真实 DOM 比较差异，可以只渲染局部
 */