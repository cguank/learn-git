const crypto = require('crypto');
const { TOKEN_SECRET, TOKEN_TTL_MS } = require('./config');

const fallbackUsers = [
  {
    id: 'user-alice',
    username: 'alice',
    password: 'alice123',
    name: 'Alice'
  },
  {
    id: 'user-bob',
    username: 'bob',
    password: 'bob123',
    name: 'Bob'
  }
];

const authUsers = loadAuthUsers();

function loadAuthUsers() {
  if (!process.env.AUTH_USERS) {
    return fallbackUsers;
  }

  try {
    const parsedUsers = JSON.parse(process.env.AUTH_USERS);

    if (!Array.isArray(parsedUsers)) {
      throw new Error('AUTH_USERS must be a JSON array.');
    }

    const normalizedUsers = parsedUsers
      .map((user, index) => ({
        id: String(user.id || `user-${index + 1}`),
        username: String(user.username || '').trim(),
        password: String(user.password || ''),
        name: String(user.name || user.username || `User ${index + 1}`).trim()
      }))
      .filter((user) => user.username && user.password);

    if (!normalizedUsers.length) {
      throw new Error('AUTH_USERS does not contain any valid user.');
    }

    return normalizedUsers;
  } catch (error) {
    console.warn(`[auth] Invalid AUTH_USERS, using demo users instead: ${error.message}`);
    return fallbackUsers;
  }
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));

  return Buffer.from(`${base64}${padding}`, 'base64').toString('utf8');
}

function signTokenValue(value) {
  return crypto.createHmac('sha256', TOKEN_SECRET)
    .update(value)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name
  };
}

function createAuthToken(user) {
  const now = Date.now();
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(JSON.stringify({
    sub: user.id,
    username: user.username,
    name: user.name,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + TOKEN_TTL_MS) / 1000)
  }));
  const signature = signTokenValue(`${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
}

function verifyAuthToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const expectedSignature = signTokenValue(`${header}.${payload}`);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const data = JSON.parse(base64UrlDecode(payload));
    const expiresAt = Number(data.exp) * 1000;

    if (!expiresAt || expiresAt <= Date.now()) {
      return null;
    }

    const user = authUsers.find((item) => item.id === data.sub && item.username === data.username);
    return user ? publicUser(user) : null;
  } catch (error) {
    return null;
  }
}

function getBearerToken(req) {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  return scheme === 'Bearer' ? token : '';
}

function findUserByCredentials(username, password) {
  return authUsers.find((user) => user.username === username && user.password === password);
}

module.exports = {
  authUsers,
  createAuthToken,
  findUserByCredentials,
  getBearerToken,
  publicUser,
  verifyAuthToken
};
