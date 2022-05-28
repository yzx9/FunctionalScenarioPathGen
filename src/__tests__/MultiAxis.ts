import { MultiAxis } from "../MultiAxis"
import { Predicate } from "../condition"
import { NumberAxis } from "../NumberAxis"
test("Multi Axis Base", () => {
  const axis = MultiAxis.fromNumberAxis("x", new NumberAxis().union(Predicate.eq, 2))
  axis.intersect(MultiAxis.fromNumberAxis("y", new NumberAxis().union(Predicate.le, 1)))
  axis.intersect(MultiAxis.fromNumberAxis("y", new NumberAxis().union(Predicate.qe, -1)))
  console.log(axis.toString())
})

test("is Super Multi Axis", () => {
  const axis = MultiAxis.fromNumberAxis("x", new NumberAxis().union(Predicate.eq, 2))
  axis.intersect(MultiAxis.fromNumberAxis("y", new NumberAxis().union(Predicate.le, 1)))
  axis.intersect(MultiAxis.fromNumberAxis("y", new NumberAxis().union(Predicate.qe, -1)))

  const axis2 = MultiAxis.fromNumberAxis("x", new NumberAxis().union(Predicate.eq, 2))
  console.log(axis.isSuperAxis(axis2))
  console.log(axis2.isSuperAxis(axis))
})
