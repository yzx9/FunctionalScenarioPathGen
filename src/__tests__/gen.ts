import { Condition, Predicate } from "../condition"
import { genFuntionalScenarioPaths } from "../path"
import { Process } from "../process"
import { Bool, Int, Money, PositiveInt, Str } from "../type"
import { isValidPath } from "../validity"

test("validate functional scenario paths, simple 1", () => {
  const condition1: Condition = ["x", Predicate.lt, 1]
  const condition2: Condition = ["x", Predicate.lt, 2]
  const pro1 = new Process("pro1", [Int], [Int], condition1, condition2)
  const pro2 = new Process("pro2", [Int], [Int], condition2, condition1)
  for (let path of genFuntionalScenarioPaths([pro1, pro2])) {
    expect(isValidPath(path)[0]).toEqual(true)
  }
})

test("generate functional scenario paths, simple 2", () => {
  const condition1: Condition = ["x", Predicate.lt, 1]
  const condition2: Condition = ["y", Predicate.lt, 2]
  const pro1 = new Process("pro1", [Int], [Int], condition1, condition2)
  const pro2 = new Process("pro2", [Int], [Int], condition1, condition1)
  const re1 = genFuntionalScenarioPaths([pro1, pro2])
  const trueFalse: [number, number] = [0, 0]
  for (let path of re1) {
    if (isValidPath(path)[0]) {
      trueFalse[0]++
    } else {
      trueFalse[1]++
    }
  }
  expect(trueFalse).toEqual([2, 1])
})

test("generate functional scenario paths, general 2", () => {
  const condition1: Condition = ["x", Predicate.lt, 1]
  const condition2: Condition = ["y", Predicate.lt, 2]
  const pro1 = new Process("pro1", [Int], [Int], condition1, condition2)
  const pro2 = new Process("pro2", [Int], [Int], condition1, condition2)
  const pro3 = new Process("pro3", [PositiveInt], [PositiveInt], condition1, condition1)
  const re = genFuntionalScenarioPaths([pro1, pro2, pro3])
  const trueFalse: [number, number] = [0, 0]
  for (let path of re) {
    if (isValidPath(path)[0]) {
      trueFalse[0]++
    } else {
      trueFalse[1]++
    }
  }
  expect(trueFalse).toEqual([3, 6])
})

test("generate functional scenario paths, line", () => {
  const pro1 = new Process("pro1", [Int], [Str])
  const pro2 = new Process("pro2", [Str], [Money])
  const pro3 = new Process("pro3", [Money], [Bool])

  const re = genFuntionalScenarioPaths([pro1, pro2, pro3])
  expect(re.length).toBe(4)
})
