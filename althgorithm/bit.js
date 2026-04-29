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
// n&(-n) 取最后一位1， n&(n-1)去掉最后一位1
// 把第 i 位清为 0：x &= ~(1 << i);
// 52 n皇后位运算
// 898， 位运算+连续子数组