function genPromise(wait, iserr = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      iserr && reject(`err ${wait}`);
      !iserr && resolve(wait);
    }, wait);
  })
}
// let p1 = genPromise(1000)
let p1 = genPromise(1000, true)
let p2 = genPromise(3000)
let p3 = genPromise(2000)
// let p4 = genPromise(4000)
let p4 = genPromise(4000, true)
const promises = [p1, p2, p3, 444, p4];

//1. async await写法
async function getResult(promises) {
  let i = 0;
  for (let i = 0; i < promises.length; i++) {
    let cc = null;
    try {
      cc = await Promise.resolve(promises[i]);
    } catch (e) {
      cc = e
    }
    console.log(cc);
  }
}

//2. 嵌套回调地狱 感觉不是很好，不是链式调用
function iteratorPromises(promises) {
  let count = 0;
  (function iter() {
    if (count === promises.length) return;
    Promise.resolve(promises[count++]).then(r => {
      console.log(r);
      iter();
    }).catch(err => {
      console.log(err);
      iter();
    })
  })()
}

//3. 链式调用，写的有问题，catch要写在then里面
function recursivePromise(promises) {
  let result = Promise.resolve(promises[0]);
  for (let i = 1; i < promises.length; i++) {
    result = result.then(r => {
      console.log(r);
      return Promise.resolve(promises[i]);
    }, err => {
      console.log('err1111', err);
      return Promise.resolve(promises[i]);
    })
    // 下面这种情况就会多打印错误一次，不请出为什么
    // result = result.then(r => {
    //   console.log(r);
    //   return Promise.resolve(promises[i]);
    // }).catch(err => {
    //   console.log('err1111',err);
    //   return Promise.resolve(promises[i]);
    // })
  }
  result.then(r => {
    console.log(r);
  }).catch(err => {
    console.log('err', err);
  })
}
recursivePromise(promises)