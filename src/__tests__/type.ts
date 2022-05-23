import { Int, PositiveInt, Str, isSubSet, merge } from "../type"

test("type relation", () => {
  expect(PositiveInt.canBeType(Int)).toBe(true)
  expect(Int.canBeType(PositiveInt)).toBe(false)

  expect(Int.canBeType(Str)).toBe(false)
})

test("type set relation", () => {
  expect(isSubSet([], [Int])).toBe(true)
  expect(isSubSet([Int], [])).toBe(false)

  expect(isSubSet([Int], [PositiveInt])).toBe(false)
  expect(isSubSet([PositiveInt], [Int])).toBe(true)

  expect(isSubSet([Int], [PositiveInt, Int])).toBe(true)

  expect(isSubSet([Int], [Int, Str])).toBe(true)
  expect(isSubSet([Str], [Int, Str])).toBe(true)
  expect(isSubSet([Str, Int], [Int, Str])).toBe(true)
  expect(isSubSet([Str, PositiveInt], [Int, Str])).toBe(true)
})

test("type merge", () => {
  expect(merge([], [])).toEqual([])
  expect(merge([], [Int])).toEqual([Int])
  expect(merge([Int], [Int])).toEqual([Int])
  expect(merge([Int], [PositiveInt])).toEqual([Int, PositiveInt])
  expect(merge([Int], [Str])).toEqual([Int, Str])
})
