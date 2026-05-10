const path = require('path');

const PORT = Number(process.env.PORT) || 3003;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MAX_BODY_BYTES = 1024 * 1024;
const TOKEN_TTL_MS = Number(process.env.AUTH_TOKEN_TTL_MS) || 12 * 60 * 60 * 1000;
const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'websocket-demo-local-secret';
const WS_HEARTBEAT_INTERVAL_MS = Number(process.env.WS_HEARTBEAT_INTERVAL_MS) || 30000;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon'
};

module.exports = {
  CONTENT_TYPES,
  MAX_BODY_BYTES,
  PORT,
  PUBLIC_DIR,
  TOKEN_SECRET,
  TOKEN_TTL_MS,
  WS_HEARTBEAT_INTERVAL_MS
};
