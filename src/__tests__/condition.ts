import { isSubCondition, Condition, Variable, Comparable, Relation, Predicate, getConditionAxes } from "../condition"

test("generate multi axis", () => {
  const condition8: Condition = ["x", Predicate.lt, 1]
  const condition9: Condition = ["y", Predicate.qt, 2]
  const condition4: Condition = [condition8, Relation.or, condition9]

  const condition5: Condition = ["x", Predicate.qt, -1]
  const condition2: Condition = [condition4, Relation.and, condition5]

  const condition6: Condition = ["y", Predicate.le, 3]
  const condition7: Condition = ["y", Predicate.qe, 0]
  const condition3: Condition = [condition6, Relation.or, condition7]

  const condition1: Condition = [condition2, Relation.and, condition3]

  const res = getConditionAxes(condition2)

  res.forEach((item) => {
    console.log(item.toString())
  })
})
