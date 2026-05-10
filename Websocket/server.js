const http = require('http');
const { PORT } = require('./src/config');
const { authUsers } = require('./src/auth');
const { createHttpHandler } = require('./src/http');
const { attachWebSocketServer } = require('./src/websocket');

const server = http.createServer(createHttpHandler());

attachWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`WebSocket demo is running at http://localhost:${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
  console.log(`Available users: ${authUsers.map((user) => user.username).join(', ')}`);
});
