const fs = require('fs');
const path = require('path');
const { CONTENT_TYPES, MAX_BODY_BYTES, PUBLIC_DIR, TOKEN_TTL_MS } = require('./config');
const {
  createAuthToken,
  findUserByCredentials,
  getBearerToken,
  publicUser,
  verifyAuthToken
} = require('./auth');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let settled = false;

    req.on('data', (chunk) => {
      if (settled) {
        return;
      }

      body += chunk.toString('utf8');

      if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
        settled = true;
        reject(Object.assign(new Error('Request body is too large.'), { statusCode: 413 }));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (settled) {
        return;
      }

      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(Object.assign(new Error('Request body must be valid JSON.'), { statusCode: 400 }));
      }
    });

    req.on('error', (error) => {
      if (!settled) {
        reject(error);
      }
    });
  });
}

async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method Not Allowed' });
    return;
  }

  const body = await readJsonBody(req);
  const username = String(body.username || '').trim();
  const password = String(body.password || '');
  const user = findUserByCredentials(username, password);

  if (!user) {
    sendJson(res, 401, { message: 'Invalid username or password.' });
    return;
  }

  sendJson(res, 200, {
    token: createAuthToken(user),
    user: publicUser(user),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString()
  });
}

function handleMe(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { message: 'Method Not Allowed' });
    return;
  }

  const user = verifyAuthToken(getBearerToken(req));

  if (!user) {
    sendJson(res, 401, { message: 'Unauthorized' });
    return;
  }

  sendJson(res, 200, { user });
}

async function handleApi(req, res, pathname) {
  try {
    if (pathname === '/api/login') {
      await handleLogin(req, res);
      return;
    }

    if (pathname === '/api/me') {
      handleMe(req, res);
      return;
    }

    sendJson(res, 404, { message: 'Not found' });
  } catch (error) {
    sendJson(res, error.statusCode || 500, {
      message: error.statusCode ? error.message : 'Internal server error.'
    });
  }
}

function serveStatic(req, res, pathname) {
  let safePath;

  try {
    safePath = decodeURIComponent(pathname);
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  const requestedPath = safePath === '/' ? '/index.html' : safePath;
  const filePath = path.resolve(PUBLIC_DIR, requestedPath.replace(/^\/+/, ''));

  if (!filePath.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': CONTENT_TYPES[ext] || 'application/octet-stream'
    });
    res.end(content);
  });
}

function createHttpHandler() {
  return (req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (pathname.startsWith('/api/')) {
      handleApi(req, res, pathname);
      return;
    }

    serveStatic(req, res, pathname);
  };
}

module.exports = {
  createHttpHandler
};
