function myajax(url) {
    return new Promise((resolve, reject) => {
        let handler = function() {
            if (this.readyState != 4) {
                return;
            }
            if (this.status == 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText))
            }
        }
        let client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();
    })
}

function loadImgUrl(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function() {
            resolve(img);
        }
        img.onerror = function() {
            reject(new Error("img error"))
        }
        img.src = url;
    })
}


// function timePromise (wait, isFalse) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             if (isFalse) {
//                 reject("error" + wait);
//             } else {
//                 resolve("sus" + wait);
//             }
//         }, wait);
//     })
// }

Promise.myall = function(promises) {
    return new Promise((resolve, reject) => {
        let done = gen(promises.length, resolve);
        promises.forEach((promise, index) => {
            promise.then(val => {
                done(val, index);
            }).catch(e => {
                reject(e);
            })
        })
    })

}

function gen(length, resolve) {
    let count = 0;
    let values = [];
    return function(val, index) {
        values[index] = val;
        if (++count == length) {
            resolve(values);
        }
    }
}
Promise.myrace = function(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            promise.then(val => {
                resolve(val);
            }).catch(e => {
                reject(e);
            })
        })
    })
}
Promise.myallSettled = function(promises) {
    return new Promise((resolve, reject) => {
        values = [];
        count = 0;
        promises.forEach((promise, index) => {
            promise.then(val => {
                values[index] = { value: val, status: 'fulfilled' };
                if (++count == promises.length) {
                    resolve(values);
                }
            }).catch(e => {
                values[index] = { reason: e, status: 'rejected' };
                if (++count == promises.length) {
                    resolve(values);
                }
            })
        })
    })
}


/**
 * 手动实现promise
 */
function MyPromise(executor) {
    let self = this;
    this.status = 'pending';
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    function resolve(val) {
        setTimeout(() => {
            if (self.status == 'pending') {
                self.status = 'resolved';
                self.data = val;
                self.onFulfilledCallbacks.forEach(callback => {
                    callback(val);
                })
            }
        });
    }

    function reject(val) {
        setTimeout(() => {
            if (self.status == 'pending') {
                self.status = 'rejected';
                self.data = val;
                self.onRejectedCallbacks.forEach(callback => {
                    callback(val);
                })
            }
        });
    }
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e);
    }
}
MyPromise.prototype.then = function(onResolve, onReject) {
    onResolve = typeof onResolve == 'function' ? onResolve : v => v;
    onReject = typeof onReject == 'function' ? onReject : e => {
        throw e
    }
    if (this.status == 'resolved') {
        return new MyPromise((resolve, reject) => {
            try {
                let result = onResolve(this.data);
                if (result instanceof MyPromise) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            } catch (e) {
                reject(e);
            }
        })
    }
    if (this.status == 'reject') {
        return new MyPromise((resolve, reject) => {
            try {
                let result = onReject(this.data);
                if (result instanceof MyPromise) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            } catch (e) {
                reject(e);
            }
        })
    }
    if (this.status == 'pending') {
        return new MyPromise((resolve, reject) => {
            this.onFulfilledCallbacks.push(() => {
                try {
                    let result = onResolve(this.data);
                    if (result instanceof MyPromise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (e) {
                    reject(e)
                }
            })
            this.onRejectedCallbacks.push(() => {
                try {
                    let result = onReject(this.data);
                    if (result instanceof MyPromise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
}
MyPromise.prototype.catch = function(onReject) {
    return this.then(null, onReject);
}
