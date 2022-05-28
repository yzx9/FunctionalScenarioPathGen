import { MultiAxis } from "../MultiAxis"
import { Predicate } from "../condition"
import { NumberAxis } from "../NumberAxis"
test("Multi Axis Base", () => {
  const axis = MultiAxis.fromNumberAxis("x", new NumberAxis().union(Predicate.eq, 2))
  axis.intersect(MultiAxis.fromNumberAxis("y", new NumberAxis().union(Predicate.le, 1)))
  axis.union(MultiAxis.fromNumberAxis("y", new NumberAxis().union(Predicate.le, 1)))
  console.log(axis.toString())
})
