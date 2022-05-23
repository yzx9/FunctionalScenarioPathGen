import { NumberAxis } from "../NumberAxis"
import { Condition, Predicate, Relation } from "../condition"

test("NumberAxis eq", () => {
  const axis = new NumberAxis().add(Predicate.eq, 1).add(Predicate.eq, 2)
  expect(axis.intervalSpaces.length).toBe(2)
})

test("NumberAxis lt", () => {
  const axis = new NumberAxis().add(Predicate.lt, 0)
  expect(axis.add(Predicate.lt, -1).intervalSpaces.length).toBe(1)
})
test("NumberAxis lt2", () => {
  const axis = new NumberAxis().add(Predicate.lt, -1).add(Predicate.lt, 0)
  expect(axis.intervalSpaces.length).toBe(1)
})
test("NumberAxis 32", () => {
  const axis = new NumberAxis().add(Predicate.lt, -1).add(Predicate.qe, -1)
  expect(axis.intervalSpaces.length).toBe(1)
})
test("NumberAxis 32", () => {
  const axis = new NumberAxis().add(Predicate.eq, -1).add(Predicate.eq, -1)
  expect(axis.intervalSpaces.length).toBe(1)
})
