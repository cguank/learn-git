const PEDNINGD = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED';
class Promise {
    constructor(executor) {
        this.status = PEDNINGD;
        this.data = null;
        this.onFulfilledCallbackArr = [];
        this.onRejectedCallbackArr = [];
      try {
            // 这里需要加上 bind 是因为 resolve 和 reject 是作为参数传递给 executor 的，
            // 这样 executor 内部调用 resolve/reject 时，this 会指向 executor 的作用域（不是 Promise 实例本身）。
            // 加上 bind(this) 可以确保 resolve/reject 内部的 this 始终指向当前的 Promise 实例。
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
    resolve (val) {
        //注意加if判断
        if (this.status === PEDNINGD) {
            this.data = val;
            this.status = FULFILLED;
            this.onFulfilledCallbackArr.forEach(fulfilledCallback => {
                fulfilledCallback();
            })
       }
    }
    reject(val) {
        if (this.status === PEDNINGD) {
            this.data = val;
            this.status = REJECTED;
            this.onRejectedCallbackArr.forEach(rejectedCallback => {
                rejectedCallback();
            })
        }
    }
    then(onFulfilledCallback, onRejectedCallback) {
          //PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4
        onFulfilledCallback = typeof onFulfilledCallback === 'function' ?
            onFulfilledCallback : data => data;
        onRejectedCallback = typeof onRejectedCallback === 'function' ?
            onRejectedCallback : err => {
                throw err
            }
        const promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                      //PromiseA+ 2.2.2
                      //PromiseA+ 2.2.4 --- setTimeout
                setTimeout(() => {
                    try {
                        //PromiseA+ 2.2.7.1
                        const x = onFulfilledCallback(this.data);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        //PromiseA+ 2.2.7.2
                        reject(e)
                    }
                }, 0);
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onRejectedCallback(this.data);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            } else if(this.status===PEDNINGD){
                this.onFulfilledCallbackArr.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilledCallback(this.data);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
                this.onRejectedCallbackArr.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejectedCallback(this.data);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                })
            }
        });
        return promise2;

    }
    catch (onRejectedCallback) {
        return this.then(null, onRejectedCallback);
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    //PromiseA+ 2.3.1
    if (promise2 === x) {
        reject(new TypeError('Chaining cycle'));
    }
    if (x && typeof x === 'object' || typeof x === 'function') {
        let used; //PromiseA+2.3.3.3.3 只能调用一次
        try {
            let then = x.then;
            if (typeof then === 'function') {
                //PromiseA+2.3.3
                then.call(x, (y) => {
                    //PromiseA+2.3.3.1
                    if (used) return;
                    used = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, (r) => {
                    //PromiseA+2.3.3.2
                    if (used) return;
                    used = true;
                    reject(r);
                });

            } else {
                resolve(x);
            }
        } catch (e) {
            //PromiseA+ 2.3.3.2
            if (used) return;
            used = true;
            reject(e);
        }
    } else {
        //PromiseA+ 2.3.4
        resolve(x);
    }
}

Promise.resolve = function (data) {
    if (data instanceof Promise) {
        return data;
    }
    return new Promise((resolve, reject) => {
        if (data && typeof data.then === 'function') {
            // 不加这个data.then会比主线程先执行
            setTimeout(() => {
                data.then(resolve, reject);
            }, 0);
        } else {
            resolve(data);
        }
    })

}

// finally 的函数不接受参数也就是说finally不会返回任何东西，同时finnally会接收前一个的传值，值穿透到下一个then
// 这个写法导致无法值穿透，同时会接收到finnaly的返回值
// Promise.prototype.finally = function (fn) {
//   return Promise.resolve(fn()).then(r=>r).catch(err=>err);
// }
// fn的返回值可能是promise，所以要等待其执行完才能传给下一个
Promise.prototype.finally = function (fn) {
    return this.then(
        res => Promise.resolve(fn()).then(() => res),
        // 注意这里是throw err，也就是说finally前是catch，fanally后也是catch
        err => Promise.resolve(fn()).then(() => {throw err})
    )
}

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let result = []
    let count = 0
    const n = promises.length

    // 参数为空直接resolve
    if (n === 0) return resolve(result)

    promises.forEach((p, index) => {
      // 兼容非Promise值
      Promise.resolve(p).then(
        (res) => {
          result[index] = res // 保证结果顺序
          count++
          if (count === n) {
            resolve(result) // 全部成功
          }
        },
        (err) => {
          reject(err) // 只要有一个失败，直接reject
        },
      )
    })
  })
}

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    // 遍历每一个promise
    promises.forEach((p) => {
      // 兼容非Promise值，第一个执行完毕的直接调用
      Promise.resolve(p).then(
        (res) => {
          resolve(res) // 成功的
        },
        (err) => {
          reject(err) // 失败的
        },
      )
    })
  })
}


module.exports = Promise;