import { isSubSet, merge, toString } from "./condition"
import { Path } from "./path"

export function isValidPath(path: Path): [boolean, string] {
  for (let i = 1; i < path.layers.length; i++) {
    const post = merge(...path.layers[i - 1].map((a) => a.post).flat())
    const pre = merge(...path.layers[i].map((a) => a.pre).flat())

    if (!isSubSet(pre, post)) {
      return [false, `${toString(pre)} is not a sub set of ${toString(post)}}`]
    }
  }

  return [true, "valid"]
}
