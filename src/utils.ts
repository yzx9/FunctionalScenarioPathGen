/**
 * 排列, C_{n}^{k}
 * @param n
 * @param k
 * @param offset
 * @returns
 */
export function getArrangement(
  n: number,
  k: number,
  offset: number = 0
): number[][] {
  if (k == 0) return [[]]
  if (n <= 0) return []

  const array: number[][] = []
  for (let i = offset; i < n - k + 1; i++) {
    const arr = getArrangement(n, k - 1, i + 1)
    array.push(...arr.map((a) => [i, ...a]))
  }

  return array
}

/**
 * 求差集
 * @param n set [0..n-1]
 * @param set ordered set
 */
export function getDifference(n: number, set: number[]): number[] {
  const arr: number[] = []
  let j = 0
  for (let i = 0; i < n; i++) {
    if (j == set.length || i < set[j]) {
      arr.push(i)
    } else {
      j++
    }
  }
  return arr
}

/**
 * 将数组依照Indexs拆分为两个数组
 * @param arr
 * @param indexs order array index
 * @returns
 */
export function divide<T>(arr: T[], indexs: number[]): [T[], T[]] {
  const re: [T[], T[]] = [[], []]

  let j = 0
  for (let i = 0; i < arr.length; i++) {
    if (j === indexs.length || i < indexs[j]) {
      re[1].push(arr[i])
    } else {
      re[0].push(arr[i])
      j++
    }
  }

  return re
}
