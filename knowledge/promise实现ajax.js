function myajax(url) {
    return new Promise((resolve, reject) => {
        let handler = function () {
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

// promise请求失败则重复请求n次,利用了串行递归方法
function retryPromise(promise, retry = 3) {
    let count = retry;
    promise = Promise.resolve(promise);
    return new Promise((resolve, reject) => {
        (function iter() {
            promise.then(r => {
                resolve(r);
            }).catch(e => {
                if (count--) {
                    iter();
                } else {
                    reject(e)
                }
            })
        })()
    })
}
// 多个promise请求，尽可能快且按顺序打印
// 1 当时做的promise做法
function fastPromises (promises) {
    const arr = [];
    let start = 0;
    function process(data, index) {
        arr[index] = data;
        for (let i = start; i < promises.length; i++) {
            if (arr[i]) {
                start++;
                console.log(arr[i]);
            } else {
                break;
            }
        }
    }
    promises.forEach((promise, index) => {
        Promise.resolve(promise).then(r => {
            process(r, index);
        }).catch(e => {
            process(e, index);
        })
    })
}
// 2 async await做法
async function logInOrder(urls) {
    // 并发读取远程URL
    const textPromises = urls.map(async url => {
        const response = await fetch(url);
        return response.text();
    });

    // 按次序输出
    for (const textPromise of textPromises) {
        console.log(await textPromise);
    }
}

////////////////////////////////
function loadImgUrl(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
            resolve(img);
        }
        img.onerror = function () {
            reject(new Error("img error"))
        }
        img.src = url;
    })
}