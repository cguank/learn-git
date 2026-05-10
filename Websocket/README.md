# WebSocket Demo

一个用于演示 WebSocket 双向通信的小项目：Node.js 服务端负责静态页面、用户登录鉴权和消息广播，浏览器客户端负责登录、连接、改名、发送消息、Ping/Pong 和在线用户展示。

## 运行

```bash
cd Websocket
npm install
npm start
```

然后打开：

```text
http://localhost:3003
```

可以同时打开多个浏览器窗口，观察消息广播和在线人数变化。

## 默认账号

本项目内置了两个演示账号：

```text
alice / alice123
bob / bob123
```

页面需要先登录，再点击「连接」。服务端会在 WebSocket 握手阶段校验 token，未登录或 token 无效时无法连接 `/ws`。

## 自定义账号和密钥

可以通过环境变量覆盖默认账号和 token 签名密钥：

```bash
AUTH_TOKEN_SECRET="change-me" \
AUTH_USERS='[{"id":"user-1","username":"tom","password":"tom123","name":"Tom"}]' \
npm start
```

也可以调整 token 有效期，单位是毫秒：

```bash
AUTH_TOKEN_TTL_MS=3600000 npm start
```

服务端也会定时发送 WebSocket 原生心跳包，默认 30 秒检查一次。可以通过环境变量调整：

```bash
WS_HEARTBEAT_INTERVAL_MS=15000 npm start
```

## 项目结构

```text
Websocket
├── package.json
├── server.js              # 启动入口
├── src
│   ├── auth.js            # 用户加载、登录校验、token 签发和校验
│   ├── config.js          # 端口、静态目录、token 配置
│   ├── http.js            # HTTP API 和静态资源服务
│   ├── messages.js        # WebSocket 消息格式
│   └── websocket.js       # WebSocket 鉴权、连接管理和广播
└── public
    ├── index.html
    ├── styles.css
    └── app.js
```

## HTTP 接口

- `POST /api/login`：传入 `{ "username": "...", "password": "..." }`，登录成功后返回 token 和用户信息
- `GET /api/me`：通过 `Authorization: Bearer <token>` 校验当前登录态

## 消息类型

- `welcome`：客户端连接成功后由服务端返回当前用户信息
- `presence`：在线用户列表和人数变更
- `rename`：客户端修改昵称
- `chat`：聊天消息广播
- `ping` / `pong`：延迟测试和浏览器端心跳检查
- `system`：用户加入、离开、改名等系统消息

浏览器端连接成功后会定时发送业务心跳。如果心跳超时或连接异常关闭，会按指数退避自动重连；用户主动点击「断开」或「退出」时不会自动重连。

默认端口是 `3003`，也可以通过环境变量覆盖：

```bash
PORT=4000 npm start
```
