import { genFuntionalScenarioPaths } from "../path"
import { Process } from "../process"
import { Bool, Int, Money, PositiveInt, Str } from "../type"

test("generate functional scenario paths, simple 2", () => {
  const pro1 = new Process("pro1", [Int], [Int])
  const pro2 = new Process("pro2", [Int], [Int])

  expect(genFuntionalScenarioPaths([pro1, pro2]).length).toBe(3)
})

test("generate functional scenario paths, simple 3", () => {
  const pro1 = new Process("pro1", [Int], [Int])
  const pro2 = new Process("pro2", [Int], [Int])
  const pro3 = new Process("pro3", [Int], [Int])

  const re = genFuntionalScenarioPaths([pro1, pro2, pro3])
  expect(re.length).toBe(16)
})

test("generate functional scenario paths, general route", () => {
  const pro1 = new Process("pro1", [Int], [Int])
  const pro2 = new Process("pro2", [Int], [Int])
  const pro3 = new Process("pro3", [PositiveInt], [PositiveInt])

  const re = genFuntionalScenarioPaths([pro1, pro2, pro3])
  expect(re.length).toBe(9)
})

test("generate functional scenario paths, line", () => {
  const pro1 = new Process("pro1", [Int], [Str])
  const pro2 = new Process("pro2", [Str], [Money])
  const pro3 = new Process("pro3", [Money], [Bool])

  const re = genFuntionalScenarioPaths([pro1, pro2, pro3])
  expect(re.length).toBe(4)
})
