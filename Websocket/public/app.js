(function () {
  const TOKEN_STORAGE_KEY = 'websocket-demo-token';
  const HEARTBEAT_INTERVAL_MS = 15000;
  const HEARTBEAT_TIMEOUT_MS = 5000;
  const RECONNECT_INITIAL_DELAY_MS = 1000;
  const RECONNECT_MAX_DELAY_MS = 10000;

  const authForm = document.querySelector('#authForm');
  const authUsernameInput = document.querySelector('#authUsername');
  const authPasswordInput = document.querySelector('#authPassword');
  const loginButton = document.querySelector('#loginButton');
  const logoutButton = document.querySelector('#logoutButton');
  const authStatus = document.querySelector('#authStatus');
  const authUserLabel = document.querySelector('#authUserLabel');
  const serverUrlInput = document.querySelector('#serverUrl');
  const displayNameInput = document.querySelector('#displayName');
  const connectButton = document.querySelector('#connectButton');
  const disconnectButton = document.querySelector('#disconnectButton');
  const renameButton = document.querySelector('#renameButton');
  const pingButton = document.querySelector('#pingButton');
  const clearButton = document.querySelector('#clearButton');
  const messageForm = document.querySelector('#messageForm');
  const messageInput = document.querySelector('#messageInput');
  const messageSubmitButton = messageForm.querySelector('button[type="submit"]');
  const messageList = document.querySelector('#messageList');
  const userList = document.querySelector('#userList');
  const onlineCount = document.querySelector('#onlineCount');
  const latencyText = document.querySelector('#latencyText');
  const statusDot = document.querySelector('#statusDot');
  const statusText = document.querySelector('#statusText');
  const endpointText = document.querySelector('#endpointText');

  let socket = null;
  let clientId = null;
  let pingStartedAt = 0;
  let authToken = window.localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  let authUser = null;
  let currentStatus = 'closed';
  let currentStatusLabel = '未连接';
  let shouldReconnect = false;
  let reconnectAttempts = 0;
  let reconnectTimer = null;
  let reconnectErrorNotified = false;
  let heartbeatTimer = null;
  let heartbeatTimeoutTimer = null;
  let heartbeatStartedAt = 0;
  let pendingHeartbeatId = '';

  if (window.location.host) {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    serverUrlInput.value = `${protocol}://${window.location.host}/ws`;
  }

  function formatTime(value) {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(value));
  }

  function isAuthenticated() {
    return Boolean(authToken && authUser);
  }

  function setAuthStatus(message, state) {
    authStatus.textContent = message;
    authStatus.classList.toggle('success', state === 'success');
    authStatus.classList.toggle('error', state === 'error');
  }

  function renderAuthState() {
    if (authUser) {
      authUserLabel.textContent = `${authUser.name} (${authUser.username})`;
      authUsernameInput.value = authUser.username;
      displayNameInput.value = authUser.name;
    } else {
      authUserLabel.textContent = '未登录';
    }

    logoutButton.disabled = !authToken;
    setStatus(currentStatus, currentStatusLabel);
  }

  function setStatus(status, label) {
    currentStatus = status;
    currentStatusLabel = label;
    statusDot.classList.toggle('connected', status === 'connected');
    statusDot.classList.toggle('error', status === 'error');
    statusText.textContent = label;
    endpointText.textContent = serverUrlInput.value;

    const isConnected = status === 'connected';
    const isConnecting = status === 'connecting';
    connectButton.disabled = !isAuthenticated() || isConnected || isConnecting;
    disconnectButton.disabled = !isConnected && !isConnecting;
    renameButton.disabled = !isConnected;
    pingButton.disabled = !isConnected;
    messageInput.disabled = !isConnected;
    messageSubmitButton.disabled = !isConnected;
  }

  function sendEvent(type, payload = {}) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      addMessage({
        type: 'error',
        text: 'WebSocket is not connected.'
      });
      return false;
    }

    socket.send(JSON.stringify({ type, ...payload }));
    return true;
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }

    if (heartbeatTimeoutTimer) {
      clearTimeout(heartbeatTimeoutTimer);
      heartbeatTimeoutTimer = null;
    }

    pendingHeartbeatId = '';
    heartbeatStartedAt = 0;
  }

  function sendHeartbeat(activeSocket) {
    if (socket !== activeSocket || activeSocket.readyState !== WebSocket.OPEN || pendingHeartbeatId) {
      return;
    }

    heartbeatStartedAt = Date.now();
    pendingHeartbeatId = `heartbeat-${heartbeatStartedAt}-${Math.random().toString(36).slice(2, 7)}`;
    activeSocket.send(JSON.stringify({
      type: 'ping',
      kind: 'heartbeat',
      requestId: pendingHeartbeatId
    }));

    heartbeatTimeoutTimer = window.setTimeout(() => {
      if (socket !== activeSocket || pendingHeartbeatId === '') {
        return;
      }

      addMessage({
        type: 'error',
        text: '心跳超时，正在尝试重连。'
      });
      activeSocket.close();
    }, HEARTBEAT_TIMEOUT_MS);
  }

  function startHeartbeat(activeSocket) {
    stopHeartbeat();
    heartbeatTimer = window.setInterval(() => {
      sendHeartbeat(activeSocket);
    }, HEARTBEAT_INTERVAL_MS);
  }

  function handleHeartbeatPong(event) {
    if (event.requestId !== pendingHeartbeatId) {
      return;
    }

    if (heartbeatTimeoutTimer) {
      clearTimeout(heartbeatTimeoutTimer);
      heartbeatTimeoutTimer = null;
    }

    latencyText.textContent = `${Date.now() - heartbeatStartedAt}ms`;
    pendingHeartbeatId = '';
    heartbeatStartedAt = 0;
  }

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function scheduleReconnect() {
    if (!shouldReconnect || !isAuthenticated() || reconnectTimer) {
      return;
    }

    const delay = Math.min(
      RECONNECT_INITIAL_DELAY_MS * (2 ** reconnectAttempts),
      RECONNECT_MAX_DELAY_MS
    );
    reconnectAttempts += 1;
    setStatus('connecting', `重连中，${Math.ceil(delay / 1000)}秒后重试`);

    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      connect({ isReconnect: true });
    }, delay);
  }

  function addMessage(event) {
    const message = document.createElement('article');
    const meta = document.createElement('div');
    const text = document.createElement('div');
    const time = event.time ? formatTime(event.time) : formatTime(Date.now());
    const isMine = event.id && event.id === clientId;

    message.className = `message ${event.type || ''} ${isMine ? 'mine' : ''}`.trim();
    meta.className = 'message-meta';
    text.className = 'message-text';

    meta.textContent = event.name ? `${event.name} · ${time}` : time;
    text.textContent = event.text || event.message || '';

    message.append(meta, text);
    messageList.append(message);
    messageList.scrollTop = messageList.scrollHeight;
  }

  function updateUsers(users) {
    userList.replaceChildren();

    if (!users.length) {
      const empty = document.createElement('li');
      empty.textContent = '暂无在线用户';
      userList.append(empty);
      return;
    }

    users.forEach((user) => {
      const item = document.createElement('li');
      item.textContent = user.id === clientId ? `${user.name} (我)` : user.name;
      userList.append(item);
    });
  }

  function resetSocketState(label) {
    stopHeartbeat();
    socket = null;
    clientId = null;
    onlineCount.textContent = '0';
    latencyText.textContent = '--';
    updateUsers([]);
    setStatus('closed', label);
  }

  async function readResponseJson(response) {
    try {
      return await response.json();
    } catch (error) {
      return {};
    }
  }

  async function hydrateSession() {
    if (!authToken) {
      renderAuthState();
      setAuthStatus('请输入账号密码登录');
      return;
    }

    setAuthStatus('正在校验登录状态...');

    try {
      const response = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await readResponseJson(response);

      if (!response.ok) {
        throw new Error(data.message || 'Login has expired.');
      }

      authUser = data.user;
      renderAuthState();
      setAuthStatus(`已登录：${authUser.name}`, 'success');
    } catch (error) {
      authToken = '';
      authUser = null;
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      renderAuthState();
      setAuthStatus('登录已过期，请重新登录', 'error');
    }
  }

  async function login(event) {
    event.preventDefault();

    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value;

    if (!username || !password) {
      setAuthStatus('请输入用户名和密码', 'error');
      return;
    }

    loginButton.disabled = true;
    setAuthStatus('登录中...');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await readResponseJson(response);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      shouldReconnect = false;
      clearReconnectTimer();
      stopHeartbeat();

      if (socket) {
        socket.close();
        resetSocketState('已断开');
      }

      authToken = data.token;
      authUser = data.user;
      window.localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      authPasswordInput.value = '';
      renderAuthState();
      setAuthStatus(`已登录：${authUser.name}`, 'success');
      addMessage({
        type: 'system',
        text: `已登录为 ${authUser.name}，现在可以连接 WebSocket。`
      });
    } catch (error) {
      setAuthStatus(error.message, 'error');
      addMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      loginButton.disabled = false;
    }
  }

  function logout() {
    shouldReconnect = false;
    clearReconnectTimer();

    if (socket) {
      socket.close();
      resetSocketState('已断开');
    }

    authToken = '';
    authUser = null;
    clientId = null;
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    renderAuthState();
    setAuthStatus('已退出登录');
    addMessage({
      type: 'system',
      text: '已退出登录。'
    });
  }

  function createAuthenticatedSocketUrl(rawUrl) {
    const url = new URL(rawUrl);

    if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
      throw new Error('Server URL must start with ws:// or wss://.');
    }

    url.searchParams.set('token', authToken);
    return url.toString();
  }

  function connect(options = {}) {
    const isReconnect = Boolean(options.isReconnect);
    const url = serverUrlInput.value.trim();

    if (!isAuthenticated()) {
      addMessage({
        type: 'error',
        text: '请先登录，再连接 WebSocket。'
      });
      return;
    }

    if (!url) {
      addMessage({
        type: 'error',
        text: 'Please enter a WebSocket URL.'
      });
      return;
    }

    if (!isReconnect) {
      shouldReconnect = true;
      reconnectAttempts = 0;
      reconnectErrorNotified = false;
      clearReconnectTimer();
    }

    if (socket) {
      socket.close();
    }

    let authenticatedUrl;

    try {
      authenticatedUrl = createAuthenticatedSocketUrl(url);
    } catch (error) {
      addMessage({
        type: 'error',
        text: error.message
      });
      return;
    }

    setStatus('connecting', isReconnect ? '重连中' : '连接中');
    const nextSocket = new WebSocket(authenticatedUrl);
    socket = nextSocket;

    nextSocket.addEventListener('open', () => {
      if (socket !== nextSocket) {
        return;
      }

      clearReconnectTimer();
      reconnectAttempts = 0;
      reconnectErrorNotified = false;
      startHeartbeat(nextSocket);
      setStatus('connected', '已连接');
    });

    nextSocket.addEventListener('message', (message) => {
      if (socket !== nextSocket) {
        return;
      }

      let event;

      try {
        event = JSON.parse(message.data);
      } catch (error) {
        addMessage({
          type: 'error',
          text: 'Received a non-JSON message from server.'
        });
        return;
      }

      if (event.type === 'welcome') {
        clientId = event.id;
        displayNameInput.value = event.name;
        addMessage({
          type: 'system',
          time: event.time,
          text: event.message
        });
        return;
      }

      if (event.type === 'presence') {
        onlineCount.textContent = String(event.count);
        updateUsers(event.users);
        return;
      }

      if (event.type === 'pong') {
        if (event.kind === 'heartbeat') {
          handleHeartbeatPong(event);
          return;
        }

        latencyText.textContent = `${Date.now() - pingStartedAt}ms`;
        addMessage({
          type: 'system',
          time: event.time,
          text: 'Server replied pong.'
        });
        return;
      }

      addMessage(event);
    });

    nextSocket.addEventListener('close', () => {
      if (socket !== nextSocket) {
        return;
      }

      stopHeartbeat();
      resetSocketState('已断开');
      scheduleReconnect();
    });

    nextSocket.addEventListener('error', () => {
      if (socket !== nextSocket) {
        return;
      }

      setStatus('error', '连接错误');
      if (!shouldReconnect || !reconnectErrorNotified) {
        addMessage({
          type: 'error',
          text: 'Connection failed. Please make sure you are logged in and the server is running.'
        });
        reconnectErrorNotified = shouldReconnect;
      }
    });
  }

  authForm.addEventListener('submit', login);
  logoutButton.addEventListener('click', logout);
  connectButton.addEventListener('click', connect);

  disconnectButton.addEventListener('click', () => {
    shouldReconnect = false;
    clearReconnectTimer();
    stopHeartbeat();

    if (socket) {
      socket.close();
    } else {
      resetSocketState('已断开');
    }
  });

  renameButton.addEventListener('click', () => {
    sendEvent('rename', {
      name: displayNameInput.value
    });
  });

  pingButton.addEventListener('click', () => {
    pingStartedAt = Date.now();
    sendEvent('ping', {
      kind: 'manual',
      requestId: `manual-${pingStartedAt}`
    });
  });

  clearButton.addEventListener('click', () => {
    messageList.replaceChildren();
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = messageInput.value.trim();

    if (!text) {
      return;
    }

    if (sendEvent('chat', { text })) {
      messageInput.value = '';
      messageInput.focus();
    }
  });

  setStatus('closed', '未连接');
  updateUsers([]);
  
  
  
  // 如何做到刷新页面，用户也是登录的？
  hydrateSession();
})();
