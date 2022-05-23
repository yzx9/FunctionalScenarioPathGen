import { NumberAxis } from "../NumberAxis"
import { Condition, Predicate, Relation } from "../condition"

test("NumberAxis eq", () => {
  const axis = new NumberAxis().add(Predicate.eq, 1).add(Predicate.eq, 2)
  expect(axis.toString()).toBe("[1,1],[2,2]")
})

test("NumberAxis (-Infinity,0)", () => {
  const axis = new NumberAxis().add(Predicate.lt, 0).add(Predicate.lt, -1)
  expect(axis.toString()).toBe("(-Infinity,0)")
})
test("NumberAxis (-Infinity,0)", () => {
  const axis = new NumberAxis().add(Predicate.lt, -1).add(Predicate.lt, 0)
  expect(axis.toString()).toBe("(-Infinity,0)")
})
test("NumberAxis (-Infinity,Infinity)", () => {
  const axis = new NumberAxis().add(Predicate.lt, -1).add(Predicate.qe, -1)
  expect(axis.toString()).toBe("(-Infinity,Infinity)")
})
test("NumberAxis [-1,-1]", () => {
  const axis = new NumberAxis().add(Predicate.eq, -1).add(Predicate.eq, -1)
  expect(axis.toString()).toBe("[-1,-1]")
})

// test("NumberAxis 32", () => {
//   const axis = new NumberAxis()
//   axis.add(Predicate.le, 0).add(Predicate.qe, -1)
//   expect(axis.toString()).toBe("[-1,0]")
//   axis.add(Predicate.le, 1)
//   expect(axis.toString()).toBe("[-Infinity,1]")
//   axis.add(Predicate.qe, 2)
//   expect(axis.toString()).toBe("[-Infinity,1],[2,Infinity]")
//   axis.add(Predicate.lt, 3)
//   expect(axis.toString()).toBe("[-Infinity,1],[2,3)")
// })
