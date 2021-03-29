// shopee 考题
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout')
}, 0)
async1();
new Promise(function (resolve) {
  console.log('promise1')
  resolve();
}).then(function () {
  console.log('promise2')
})
console.log('script end')

//async函数返回的 Promise 对象，必须等到内部所有await命令后面的 Promise 对象执行完及后面的return执行完，才会发生状态改变
// 第一例子
async function async1() {
  console.log('async1 start');
  Promise.resolve(async2()).then(() => {
    console.log('async1 end');
  })
}
async function async2() {
  console.log('async2');
  Promise.resolve(async3()).then(() => {
    console.log(123);
  })
}
async function async3() {
  console.log('async3');
  Promise.resolve(async4()).then(() => {
    console.log(456);
  })
}
async function async4() {
  await console.log('async4');
  console.log(789)
}
console.log('script start');
setTimeout(function () {
  console.log('setTimeout');
}, 0)
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end');

// 2
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
  await async3()
  console.log(123)
}
async function async3() {
  console.log('async3');
  await async4()
  console.log(456)
}
async function async4() {
  await console.log('async4');
  console.log(789)
}
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});

// 3
async function async1() {
  console.log('async1 start');
  Promise.resolve(async2()).then(() => {
    console.log('async1 end');
  })
}
async function async2() {
  console.log('async2');
  Promise.resolve(async3()).then(() => {
    console.log(123);
  })
}
async function async3() {
  console.log('async3');
  Promise.resolve(async4()).then(() => {
    console.log(456);
  })
}
async function async4() {
  Promise.resolve().then(() => {
    console.log(789);
  })
}
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});