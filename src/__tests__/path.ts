import { genFuntionalScenarioPaths } from "../path"
import { Process } from "../process"
import { Bool, Int, Money, Str } from "../type"

test("generate functional scenario paths, simple", () => {
  const pro1 = new Process("pro1", [Int], [Int])
  const pro2 = new Process("pro2", [Int], [Int])
  const pro3 = new Process("pro3", [Int], [Int])

  const re1 = genFuntionalScenarioPaths([pro1, pro2])
  expect(re1.length).toBe(3)

  const re2 = genFuntionalScenarioPaths([pro1, pro2, pro3])
  expect(re2.length).toBe(13)
})

test("generate functional scenario paths, line", () => {
  const pro1 = new Process("pro1", [Int], [Str])
  const pro2 = new Process("pro2", [Str], [Money])
  const pro3 = new Process("pro3", [Money], [Bool])

  const re = genFuntionalScenarioPaths([pro1, pro2, pro3])
  expect(re.length).toBe(4)
})
