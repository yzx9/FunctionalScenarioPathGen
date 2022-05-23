import { NumberAxis } from "../NumberAxis"
import { Condition, Predicate, Relation } from "../condition"

test("NumberAxis union eq", () => {
  const axis = new NumberAxis().union(Predicate.eq, 1).union(Predicate.eq, 2)
  expect(axis.toString()).toBe("[1,1],[2,2]")
})

test("NumberAxis union (-Infinity,0)", () => {
  const axis = new NumberAxis().union(Predicate.lt, 0).union(Predicate.lt, -1)
  expect(axis.toString()).toBe("(-Infinity,0)")
})
test("NumberAxis union (-Infinity,0)", () => {
  const axis = new NumberAxis().union(Predicate.lt, -1).union(Predicate.lt, 0)
  expect(axis.toString()).toBe("(-Infinity,0)")
})
test("NumberAxis union (-Infinity,Infinity)", () => {
  const axis = new NumberAxis().union(Predicate.lt, -1).union(Predicate.qe, -1)
  expect(axis.toString()).toBe("(-Infinity,Infinity)")
})
test("NumberAxis union [-1,-1]", () => {
  const axis = new NumberAxis().union(Predicate.eq, -1).union(Predicate.eq, -1)
  expect(axis.toString()).toBe("[-1,-1]")
})

test("NumberAxis intersect", () => {
  const axis = new NumberAxis()
  axis.union(Predicate.le, 0).intersect(Predicate.qe, -1)
  expect(axis.toString()).toBe("[-1,0]")
  axis.intersect(Predicate.eq, 1)
  expect(axis.toString()).toBe("")
  axis.union(Predicate.eq, 1).intersect(Predicate.eq, 1)
  expect(axis.toString()).toBe("[1,1]")
})
