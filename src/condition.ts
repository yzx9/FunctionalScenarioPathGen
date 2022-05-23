import { NumberAxis } from "./NumberAxis"
import { isSuperset, intersection } from "./setOperations"

export type Variable = string

export type Comparable = number

export enum Predicate {
  eq, // ==
  lt, // <
  le, // <=
  qt, // >
  qe, // >=
}

export enum Relation {
  and,
  or,
}

export type Condition =
  | [Variable, Predicate, Comparable]
  | [Condition, Relation, Condition]

export function and(...conditions: Condition[]): Condition {
  let cond = conditions[0]
  for (let i = 1; i < conditions.length; i++)
    cond = [cond, Relation.and, conditions[i]]

  return cond
}

/**
 * 判断 A 是否为 B 的子集
 * @param a
 * @param b
 * @returns
 */
export function isSubCondition(a: Condition, b: Condition): boolean {
  const aAxes = getConditionAxes(a)
  const bAxes = getConditionAxes(b)
  const aVars = new Set([...aAxes.keys()])
  const bVars = new Set([...bAxes.keys()])

  if (isSuperset(aVars, bVars)) {
    const intersectVars = intersection(aVars, bVars)
    for (let variable of intersectVars) {
      if (!aAxes.get(variable).isContainAxis(bAxes.get(variable))) {
        return false
      }
    }
    return true
  } else {
    return false
  }
}

function getConditionAxes(c: Condition) {
  const conditions: [Variable, Predicate, Comparable][] = []
  const axes = new Map<Variable, NumberAxis>()

  function inorderTraversal(condition: Condition) {
    // Condition is a root node
    if (typeof condition[0] === "string") {
      conditions.push(condition as [Variable, Predicate, Comparable])
    } else {
      inorderTraversal(condition[0] as [Condition, Relation, Condition])
      inorderTraversal(condition[2] as [Condition, Relation, Condition])
    }
  }
  inorderTraversal(c)

  conditions.forEach((item) => {
    const [variable, op, num] = item
    if (axes.has(variable)) {
      axes.get(variable).add(op, num)
    } else {
      axes.set(variable, new NumberAxis().add(op, num))
    }
  })

  return axes
}

export function toString(cond: Condition): string {
  if (typeof cond[0] === "string") {
    let op: string
    switch (cond[1]) {
      case Predicate.eq:
        op = "="
      case Predicate.lt:
        op = "<"
      case Predicate.le:
        op = "<="
      case Predicate.qt:
        op = ">"
      case Predicate.qe:
        op = ">="
    }

    return `${cond[0]} ${op} ${cond[2]}`
  } else {
    let op: string
    switch (cond[1]) {
      case Relation.and:
        op = "and"
      case Relation.or:
        op = "or"
    }

    return toString(cond[0]) + ` ${op} ` + toString(cond[2] as Condition)
  }
}
