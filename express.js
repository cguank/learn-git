let express = require('express');
let app = new express();
let cookieParse = require('cookie-parser');
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8085');
    res.header('Access-Control-Allow-Headers', "*,cache-control,Content-Type,Range,token,accept");
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
}
app.use(allowCrossDomain);
app.use(cookieParse());
// app.use(function(req, res, next) {

// })
app.get('/hello', (req, res) => {
    console.log(req.query, req.params);
    res.setHeader("cache-control", "max-age=1")
    res.setHeader("etag", "123456")
        //console.log(req.headers["if-none-match"], res.headers);
        // if (req.headers["if-none-match"] == "123456") {
        //     res.statusCode = 304;
        //     console.log(11111);
        //     // console.log(res);


    //     return res.end();
    // }


    // res.cookie("name", "ccc", {
    //         maxAge: 10000000,
    //         path: "http://localhost:3000/",
    //         domain: "http://localhost:3000/",
    //         httpOnly: false
    //     })
    //res.setHeader("cache-control", "max-age=3600");
    //res.setHeader("content-type", 'text/plain');
    //res.setHeader('content-range', 'bytes 0-5/8')
    // res.setHeader("Content-Length", 5)
    let cb = req.query.callback;
    res.send("sfjsdof");
})
app.get('/cookie', (req, res) => {
    console.log(req.cookies.name, req.cookies.aaa);


    res.send(req.cookies.name);
})

app.get("/jsonp", (req, res) => {

    let rtParams = {};
    let callback = req.query.callback;
    //console.log(req.query);

    for (let key in req.query) {
        let k = decodeURIComponent(key);
        rtParams[k] = decodeURIComponent(req.query[k]);
    }
    console.log(rtParams);

    // res.setHeader("content-type", "application/json")
    res.send(`${callback}(${JSON.stringify(rtParams)})`);
})

app.post("/ppost", (req, res) => {
    console.log(req.body);
    res.send('111')

})
app.post("/file", (req, res) => {
    console.log(req.body);
    res.send('111')

})
let server = app.listen(3000, () => {
    console.log('服务器在3000端口');

})


// var ws = require('nodejs-websocket');
// var wsserver = ws.createServer(function(socket) {

//     //console.log(socket);

//     // 事件名称为text(读取字符串时，就叫做text)，读取客户端传来的字符串
//     var count = 1;
//     socket.on('text', function(str) {
//         // 在控制台输出前端传来的消息　　
//         console.log(str);
//         //向前端回复消息
//         socket.sendText('服务器端收到客户端端发来的消息了！' + count++);
//     });
// }).listen(3003, () => {
//     console.log('ws server create');
// });