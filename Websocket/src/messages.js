function createPayload(type, data = {}) {
  return JSON.stringify({
    type,
    time: new Date().toISOString(),
    ...data
  });
}

module.exports = {
  createPayload
};
