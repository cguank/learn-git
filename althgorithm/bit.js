function isValidMask(str) {
  const MAX_MASK = BigInt(0xffffffff)
  const parts = str.split('.')
  let binary = 0n
  for (const item of parts) {
    binary = (binary << 8n) | BigInt(+item)
  }
  if (binary === 0n || binary === MAX_MASK) return false
  // 用这个判断是不是有效的掩码
  if ((binary | (binary - 1n)) !== MAX_MASK) return false
  return true
}
