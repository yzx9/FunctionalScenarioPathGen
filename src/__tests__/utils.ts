import { divide, getDifference, getArrangement, getFullArray } from "../utils"

test("get arrayangement", () => {
  expect(getArrangement(1, 1)).toEqual([[0]])
  expect(getArrangement(2, 1)).toEqual([[0], [1]])
  expect(getArrangement(2, 2)).toEqual([[0, 1]])
  expect(getArrangement(3, 1)).toEqual([[0], [1], [2]])
  expect(getArrangement(3, 2)).toEqual([
    [0, 1],
    [0, 2],
    [1, 2],
  ])
  expect(getArrangement(3, 3)).toEqual([[0, 1, 2]])
  expect(getArrangement(4, 1)).toEqual([[0], [1], [2], [3]])
  expect(getArrangement(4, 2)).toEqual([
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ])
  expect(getArrangement(4, 3)).toEqual([
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 3],
    [1, 2, 3],
  ])
  expect(getArrangement(4, 4)).toEqual([[0, 1, 2, 3]])
})

test("get full array", () => {
  expect(getFullArray([1])).toEqual([[0]])
  expect(getFullArray([1, 2])).toEqual([
    [0, 0],
    [0, 1],
  ])
  expect(getFullArray([2, 2])).toEqual([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ])
})

test("get difference", () => {
  expect(getDifference(1, [])).toEqual([0])
  expect(getDifference(2, [])).toEqual([0, 1])
  expect(getDifference(3, [])).toEqual([0, 1, 2])

  expect(getDifference(3, [0])).toEqual([1, 2])
  expect(getDifference(3, [1])).toEqual([0, 2])
  expect(getDifference(3, [0, 1])).toEqual([2])
  expect(getDifference(3, [0, 2])).toEqual([1])
  expect(getDifference(3, [1, 2])).toEqual([0])
  expect(getDifference(3, [0, 1, 2])).toEqual([])

  expect(getDifference(4, [0])).toEqual([1, 2, 3])
  expect(getDifference(4, [0, 2])).toEqual([1, 3])
  expect(getDifference(4, [0, 1, 2, 3])).toEqual([])
})

test("divide array", () => {
  expect(divide(["a", "b"], [])).toEqual([[], ["a", "b"]])
  expect(divide(["a", "b"], [0])).toEqual([["a"], ["b"]])
  expect(divide(["a", "b"], [1])).toEqual([["b"], ["a"]])
  expect(divide(["a", "b"], [0, 1])).toEqual([["a", "b"], []])

  expect(divide(["a", "b", "c"], [0])).toEqual([["a"], ["b", "c"]])
  expect(divide(["a", "b", "c"], [0, 1])).toEqual([["a", "b"], ["c"]])
  expect(divide(["a", "b", "c"], [0, 1, 2])).toEqual([["a", "b", "c"], []])
})
