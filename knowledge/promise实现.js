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
Promise.prototype.finally = function (fn) {
    return this.then(
        res => Promise.resolve(fn()).then(() => res),
        // 注意这里是throw err，也就是说finally前是catch，fanally后也是catch
        err => Promise.resolve(fn()).then(() => {throw err})
    )
}

Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
module.exports = Promise;