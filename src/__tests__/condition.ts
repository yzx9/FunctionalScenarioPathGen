import { isSubCondition, Condition, Variable, Comparable, Relation, Predicate } from "../condition"
test("isSubCondition", () => {
  let condition1: Condition = ["x", Predicate.lt, 2]
  let condition2: Condition = ["x", Predicate.lt, 2]
  let res = isSubCondition(condition2, condition1)
  expect(res).toBe(true)
})
