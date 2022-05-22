export type Variable = string

export type Comparable = number

export enum Predicate {
  eq,
  lt,
  le,
  qt,
  qe,
}

export enum Relation {
  and,
  or,
}

export type Condition =
  | [Variable, Predicate, Comparable]
  | [Condition, Relation, Condition]

/**
 * 判断 A 是否为 B 的子集
 * @param a
 * @param b
 * @returns
 */
export function isSubSet(a: Condition, b: Condition): boolean {
  // TODO
  return false
}
