import { isSubCondition, and, toString } from "./condition"
import { Path } from "./path"

export function isValidPath(path: Path): [boolean, string] {
  for (let i = 1; i < path.layers.length; i++) {
    const post = and(...path.layers[i - 1].map((a) => a.post).flat())
    const pre = and(...path.layers[i].map((a) => a.pre).flat())

    if (!isSubCondition(pre, post)) {
      return [false, `${toString(pre)} is not a sub set of ${toString(post)}}`]
    }
  }

  return [true, "valid"]
}
