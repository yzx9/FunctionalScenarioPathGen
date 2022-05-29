import { Int, PositiveInt, Str, isSubSet, merge } from "../type"

test("type relation", () => {
  expect(PositiveInt.canBeType(Int)).toBeTruthy()
  expect(Int.canBeType(PositiveInt)).toBeFalsy()

  expect(Int.canBeType(Str)).toBeFalsy()
})

test("type set relation", () => {
  expect(isSubSet([], [Int])).toBeTruthy()
  expect(isSubSet([Int], [])).toBeFalsy()

  expect(isSubSet([Int], [PositiveInt])).toBeFalsy()
  expect(isSubSet([PositiveInt], [Int])).toBeTruthy()

  expect(isSubSet([Int], [PositiveInt, Int])).toBeTruthy()

  expect(isSubSet([Int], [Int, Str])).toBeTruthy()
  expect(isSubSet([Str], [Int, Str])).toBeTruthy()
  expect(isSubSet([Str, Int], [Int, Str])).toBeTruthy()
  expect(isSubSet([Str, PositiveInt], [Int, Str])).toBeTruthy()
})

test("type merge", () => {
  expect(merge([], [])).toEqual([])
  expect(merge([], [Int])).toEqual([Int])
  expect(merge([Int], [Int])).toEqual([Int])
  expect(merge([Int], [PositiveInt])).toEqual([Int, PositiveInt])
  expect(merge([Int], [Str])).toEqual([Int, Str])
})
