function twoSum(nums, l, r, target) {
  const res = []
  while (l < r) {
    const sum = nums[l] + nums[r]
    if (sum === target) {
      res.push([nums[l], nums[r]])
      while (l < r && nums[l] === nums[l + 1]) {
        l++
      }
      while (l < r && nums[r] === nums[r - 1]) {
        r--
      }
    } else if (sum > target) {
      r--
    } else l++
  }
  return res
}

/**
 * 两数之和：返回原数组中的索引位置
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSumIndex(nums, target) {
  const numToIndex = new Map()

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]

    if (numToIndex.has(need)) {
      return [numToIndex.get(need), i]
    }

    numToIndex.set(nums[i], i)
  }

  return []
}

console.log(twoSumIndex([2, 7, 11, 15], 9)) // [0, 1]

/**
 * 两数之和：返回所有满足条件的原数组索引组合
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
function twoSumAllIndex(nums, target) {
  const res = []
  const numToIndexes = new Map()

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]

    if (numToIndexes.has(need)) {
      const indexes = numToIndexes.get(need)

      for (let j = 0; j < indexes.length; j++) {
        res.push([indexes[j], i])
      }
    }

    if (!numToIndexes.has(nums[i])) {
      numToIndexes.set(nums[i], [])
    }

    numToIndexes.get(nums[i]).push(i)
  }

  return res
}

console.log(twoSumAllIndex([1, 2, 3, 2, 4, 1], 4)) // [[0, 2], [1, 3], [2, 5]]

/**
 * 有序数组两数之和：返回所有满足条件的索引组合
 * @param {number[]} nums 升序数组
 * @param {number} target
 * @return {number[][]}
 */
function twoSumSortedAllIndex(nums, target) {
  const res = []
  let l = 0
  let r = nums.length - 1

  while (l < r) {
    const sum = nums[l] + nums[r]

    if (sum < target) {
      l++
    } else if (sum > target) {
      r--
    } else {
      const leftVal = nums[l]
      const rightVal = nums[r]

      if (leftVal === rightVal) {
        for (let i = l; i <= r; i++) {
          for (let j = i + 1; j <= r; j++) {
            res.push([i, j])
          }
        }
        break
      }

      const leftIndexes = []
      const rightIndexes = []

      while (l < r && nums[l] === leftVal) {
        leftIndexes.push(l)
        l++
      }

      while (l <= r && nums[r] === rightVal) {
        rightIndexes.push(r)
        r--
      }

      for (let i = 0; i < leftIndexes.length; i++) {
        for (let j = 0; j < rightIndexes.length; j++) {
          res.push([leftIndexes[i], rightIndexes[j]])
        }
      }
    }
  }

  return res
}

console.log(twoSumSortedAllIndex([1, 1, 2, 2, 3, 3], 4)) // [[0, 5], [0, 4], [1, 5], [1, 4], [2, 3]]
console.log(twoSumSortedAllIndex([2, 2, 2, 2], 4)) // [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]

/**
 * 无序数组三数之和：返回所有满足条件的原数组索引组合
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
function threeSumAllIndex(nums, target = 0) {
  const res = []
  const sumToPairs = new Map()

  for (let k = 0; k < nums.length; k++) {
    const need = target - nums[k]

    if (sumToPairs.has(need)) {
      const pairs = sumToPairs.get(need)

      for (let i = 0; i < pairs.length; i++) {
        res.push([pairs[i][0], pairs[i][1], k])
      }
    }

    for (let i = 0; i < k; i++) {
      const sum = nums[i] + nums[k]

      if (!sumToPairs.has(sum)) {
        sumToPairs.set(sum, [])
      }

      sumToPairs.get(sum).push([i, k])
    }
  }
  console.log('sumToPairs', sumToPairs)

  return res
}

console.log('====', threeSumAllIndex([-1, 0, 1, 2, -1, -4])) // [[0, 1, 2], [0, 3, 4], [1, 2, 4]]
console.log('===', threeSumAllIndex([0, 0, 0, 0])) // [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]]

var threeSum = function (nums) {
  const sortedNums = nums.slice().sort((a, b) => a - b)
  const res = []

  for (let i = 0; i < sortedNums.length - 2; i++) {
    if (i > 0 && sortedNums[i] === sortedNums[i - 1]) {
      continue
    }

    let l = i + 1
    let r = sortedNums.length - 1

    while (l < r) {
      const sum = sortedNums[i] + sortedNums[l] + sortedNums[r]

      if (sum === 0) {
        res.push([sortedNums[i], sortedNums[l], sortedNums[r]])

        while (l < r && sortedNums[l] === sortedNums[l + 1]) {
          l++
        }
        while (l < r && sortedNums[r] === sortedNums[r - 1]) {
          r--
        }

        l++
        r--
      } else if (sum < 0) {
        l++
      } else {
        r--
      }
    }
  }

  return res
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]))
