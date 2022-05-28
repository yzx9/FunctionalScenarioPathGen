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

test("NumberAxis union NumberAxis", () => {
  const axis1 = new NumberAxis()
  axis1.union(Predicate.le, 1).intersect(Predicate.qe, -1)
  axis1.union(Predicate.qe, 2).intersect(Predicate.le, 4)
  expect(axis1.toString()).toBe("[-1,1],[2,4]")

  const axis2 = new NumberAxis()
  axis2.union(Predicate.le, 0).intersect(Predicate.qe, -2)
  axis2.union(Predicate.qe, 3).intersect(Predicate.le, 5)
  expect(axis2.toString()).toBe("[-2,0],[3,5]")
  axis1.unionAxis(axis2)

  expect(axis1.toString()).toBe("[-2,1],[2,5]")
})

test("NumberAxis union NumberAxis", () => {
  const axis1 = new NumberAxis()

  const axis2 = new NumberAxis()
  axis2.union(Predicate.le, 0).intersect(Predicate.qe, -2)
  axis2.union(Predicate.qe, 3).intersect(Predicate.le, 5)
  expect(axis2.toString()).toBe("[-2,0],[3,5]")
  axis1.unionAxis(axis2)

  expect(axis1.toString()).toBe("[-2,0],[3,5]")
})

test("NumberAxis intersect NumberAxis", () => {
  const axis1 = new NumberAxis()
  axis1.union(Predicate.le, 1).intersect(Predicate.qe, -1)
  axis1.union(Predicate.qe, 2).intersect(Predicate.le, 4)
  expect(axis1.toString()).toBe("[-1,1],[2,4]")

  const axis2 = new NumberAxis()
  axis2.union(Predicate.le, 0).intersect(Predicate.qe, -2)
  axis2.union(Predicate.qe, 3).intersect(Predicate.le, 5)
  expect(axis2.toString()).toBe("[-2,0],[3,5]")
  axis1.intersectAxis(axis2)

  expect(axis1.toString()).toBe("[-1,0],[3,4]")
})

test("NumberAxis union NumberAxis", () => {
  const axis1 = new NumberAxis()

  const axis2 = new NumberAxis()
  axis2.union(Predicate.le, 0).intersect(Predicate.qe, -2)
  axis2.union(Predicate.qe, 3).intersect(Predicate.le, 5)
  expect(axis2.toString()).toBe("[-2,0],[3,5]")
  axis1.intersectAxis(axis2)

  expect(axis1.toString()).toBe("")
})
