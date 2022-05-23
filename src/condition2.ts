import { NumberAxis } from "./NumberAxis"
import { isSuperset, intersection } from "./setOperations"
import { Condition } from "./condition"

export enum Predicate {
  eq, // ==
}

export enum Relation {
  and,
}

export { and, toString, Condition, Variable, Comparable } from "./condition"

/**
 * 判断 A 是否为 B 的子集
 * @param a
 * @param b
 * @returns
 */
export function isSubCondition(a: Condition, b: Condition): boolean {
  const setA = toSet(a)
  const setB = toSet(b)
  return isSuperset(setB, setA)
}

function toSet(a: Condition, set: Set<string> = new Set()): Set<string> {
  if (typeof a[0] == "string") {
    set.add(_toString(a))
  } else {
    toSet(a[0], set)
    toSet(a[2] as Condition, set)
  }

  return set
}

function _toString(cond: Condition): string {
  let op: string
  switch (cond[1]) {
    case Predicate.eq:
      op = "="
  }

  return `${cond[0]} ${op} ${cond[2]}`
}
