/**
 * 来一个中等难度、前端面试里也比较合适的。

题目：零钱兑换（LeetCode 322）

给你一个整数数组 coins，表示不同面额的硬币；再给你一个整数 amount，表示总金额。

请你计算并返回凑成总金额所需的最少硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1。

示例 1

 

输入：coins = [1, 2, 5], amount = 11

输出：3

解释：11 = 5 + 5 + 1

 

示例 2

 

输入：coins = [2], amount = 3

输出：-1

 

示例 3

 

输入：coins = [1], amount = 0

输出：0
 */

// 518
function exchange(coins, amount) {
  if (amount === 0) return 0
  const dp = new Array(amount + 1).fill(0)
  dp[0] = 1
  // 思考为何amount在外不行
  for (let i = 0; i < coins.length; i++) {
    for (let j = 1; j <= amount; j++) {
      const diff = j - coins[i]
      if (diff >= 0) dp[j] += dp[diff]
    }
  }
  return dp[amount] || -1
}
// 518
var change = function (coins, amount) {
  const dp = Array.from({ length: amount + 1 }, (_) => [])

  for (let i = 0; i <= amount; i++) {
    dp[i][0] = 0
  }
  for (let i = 0; i <= coins.length; i++) {
    dp[0][i] = 1
  }
  // 放外层也可以
  for (let j = 1; j <= coins.length; j++) {
    const c = coins[j - 1]
    for (let i = 1; i <= amount; i++) {
      if (i >= c) {
        dp[i][j] = dp[i][j - 1] + dp[i - c][j]
      } else {
        dp[i][j] = dp[i][j - 1]
      }
    }
  }
  // 对比一维，为何coin在里，也不会出现排列
  /**
   * 二维 dp：状态 dp[i][j] = 前j种硬币→ 顺序被状态锁死→ coins 放内层也不会乱→ 永远是组合
一维 dp：无 “前 j 种” 信息→ 顺序靠循环控制→ coins 在内层 = 可乱序 = 排列 = 错误
   */
  // for (let i = 1; i <= amount; i++) {
  //   for (let j = 1; j <= coins.length; j++) {
  //     if (i - coins[j - 1] >= 0) {
  //       dp[i][j] = dp[i][j - 1] + dp[i - coins[j - 1]][j]
  //     } else {
  //       dp[i][j] = dp[i][j - 1]
  //     }
  //   }
  // }

  return dp[amount][coins.length]
}

// 322
// function exchange (coins, amount) {
//   const dp = new Array(amount+1).fill(Infinity);
//   dp[0] = 0;
//   for (let i = 0; i <coins.length; i++) {
//     for (let j = 1; j <= amount; j++) {
//       const diff = j - coins[i];
//       if (diff >= 0) dp[j] = Math.min(dp[j], dp[diff]+1);
//     }
//   }
//   return dp[amount] === Infinity ? -1 : dp[amount];
// }


console.log(change([1, 2, 5], 3))




// 01背包
var knapsack = function (W, wt, val) {
  let N = wt.length
  // base case 已初始化
  let dp = new Array(N + 1).fill().map(() => new Array(W + 1).fill(0))
  for (let i = 1; i <= N; i++) {
    for (let w = 1; w <= W; w++) {
      if (w - wt[i - 1] < 0) {
        // 这种情况下只能选择不装入背包
        dp[i][w] = dp[i - 1][w]
      } else {
        // 装入或者不装入背包，择优
        dp[i][w] = Math.max(dp[i - 1][w - wt[i - 1]] + val[i - 1], dp[i - 1][w])
      }
    }
  }

  return dp[N][W]
}
var knapsack = function (W, wt, val) {
  const N = wt.length
  const dp = new Array(W + 1).fill(0)

  for (let i = 0; i < N; i++) {
    const tw = wt[i]
    for (let w = W; w >= tw; w--) {
      dp[w] = Math.max(dp[w], dp[w - tw] + val[i])
    }
  }

  return dp[W]
}