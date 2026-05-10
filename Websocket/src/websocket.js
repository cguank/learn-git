const { WebSocket, WebSocketServer } = require('ws');
const { verifyAuthToken } = require('./auth');
const { WS_HEARTBEAT_INTERVAL_MS } = require('./config');
const { createPayload } = require('./messages');

function rejectUpgrade(socket, statusCode, reason) {
  socket.write(`HTTP/1.1 ${statusCode} ${reason}\r\nConnection: close\r\n\r\n`);
  socket.destroy();
}

function attachWebSocketServer(server) {
  const clients = new Map();
  const wss = new WebSocketServer({ noServer: true });

  function broadcast(type, data) {
    const payload = createPayload(type, data);

    for (const client of clients.values()) {
      if (client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(payload);
      }
    }
  }

  function sendClientList() {
    broadcast('presence', {
      count: clients.size,
      users: Array.from(clients.values()).map((client) => ({
        id: client.id,
        userId: client.userId,
        username: client.username,
        name: client.name
      }))
    });
  }

  server.on('upgrade', (req, socket, head) => {
    const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (pathname !== '/ws') {
      rejectUpgrade(socket, 404, 'Not Found');
      return;
    }

    const user = verifyAuthToken(searchParams.get('token'));

    if (!user) {
      rejectUpgrade(socket, 401, 'Unauthorized');
      return;
    }

    req.user = user;
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', (socket, req) => {
    const authUser = req.user;
    const id = `conn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const client = {
      id,
      userId: authUser.id,
      username: authUser.username,
      name: authUser.name,
      isAlive: true,
      socket
    };

    clients.set(id, client);

    socket.send(createPayload('welcome', {
      id,
      user: {
        id: client.userId,
        username: client.username,
        name: client.name
      },
      name: client.name,
      message: `Connected as ${client.name}.`
    }));

    broadcast('system', {
      message: `${client.name} joined the room.`
    });
    sendClientList();

    socket.on('message', (rawMessage) => {
      let event;

      try {
        event = JSON.parse(rawMessage.toString());
      } catch (error) {
        socket.send(createPayload('error', {
          message: 'Server only accepts JSON messages.'
        }));
        return;
      }

      if (event.type === 'rename') {
        const nextName = String(event.name || '').trim().slice(0, 24);

        if (!nextName) {
          socket.send(createPayload('error', {
            message: 'Name cannot be empty.'
          }));
          return;
        }

        const previousName = client.name;
        client.name = nextName;
        broadcast('system', {
          message: `${previousName} is now ${client.name}.`
        });
        sendClientList();
        return;
      }

      if (event.type === 'chat') {
        const text = String(event.text || '').trim().slice(0, 500);

        if (!text) {
          socket.send(createPayload('error', {
            message: 'Message cannot be empty.'
          }));
          return;
        }

        broadcast('chat', {
          id: client.id,
          userId: client.userId,
          username: client.username,
          name: client.name,
          text
        });
        return;
      }

      if (event.type === 'ping') {
        socket.send(createPayload('pong', {
          kind: event.kind || 'manual',
          message: 'pong',
          requestId: event.requestId || null
        }));
        return;
      }

      socket.send(createPayload('error', {
        message: `Unknown event type: ${event.type}`
      }));
    });

    socket.on('pong', () => {
      client.isAlive = true;
    });

    socket.on('close', () => {
      clients.delete(id);
      broadcast('system', {
        message: `${client.name} left the room.`
      });
      sendClientList();
    });

    socket.on('error', (error) => {
      console.error(`[ws:error] ${client.id}`, error.message);
    });
  });

  const heartbeatTimer = setInterval(() => {
    for (const client of clients.values()) {
      if (client.socket.readyState !== WebSocket.OPEN) {
        clients.delete(client.id);
        continue;
      }

      if (!client.isAlive) {
        client.socket.terminate();
        continue;
      }

      client.isAlive = false;
      client.socket.ping();
    }
  }, WS_HEARTBEAT_INTERVAL_MS);

  wss.on('close', () => {
    clearInterval(heartbeatTimer);
  });

  return wss;
}

module.exports = {
  attachWebSocketServer
};
