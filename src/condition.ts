import { cloneDeep } from "lodash"

import { MultiAxis } from "./MultiAxis"

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

export type ConditionLeaf = [Variable, Predicate, Comparable]
export type Condition = ConditionLeaf | [Condition, Relation, Condition]

export function and(...conditions: Condition[]): Condition {
  let cond = conditions[0]
  for (let i = 1; i < conditions.length; i++) cond = [cond, Relation.and, conditions[i]]

  return cond
}

/**
 * 判断 outCond 的输出结果是否能输入到 inCond 中
 * @param outCond
 * @param inCond
 * @returns 若条件成立，则输出[out -> in](即可能成立的一条路径) 否则输出 false
 */
export function isSubCondition(outCond: Condition, inCond: Condition): [MultiAxis, MultiAxis] | boolean {
  const outAxes = getConditionAxes(outCond)
  const inAxes = getConditionAxes(inCond)
  for (let o of outAxes) {
    for (let i of inAxes) {
      if (i.isSuperAxis(o)) {
        return [o, i]
      }
    }
  }
  return false
}

function preorderTraversal(cond: Condition): MultiAxis[] {
  if (!isLeaf(cond)) {
    if (cond[1] === Relation.and) {
      return conjunction(preorderTraversal(cond[0]), preorderTraversal(cond[2]))
    }
    if (cond[1] === Relation.or) {
      return disjunction(preorderTraversal(cond[0]), preorderTraversal(cond[2]))
    }
  } else {
    return [MultiAxis.fromCondition(cond)]
  }
}

export function getConditionAxes(cond: Condition): MultiAxis[] {
  return preorderTraversal(cond)
}

// 合取 and
// (A or B) and (C or D) = (A and C) or (A and D) or (B and C) or (B and D)
function conjunction(lAxes: MultiAxis[], rAxes: MultiAxis[]): MultiAxis[] {
  if (lAxes.length === 0 || rAxes.length === 0) {
    throw new Error("empty axes is not allowed")
  }
  const result: MultiAxis[] = []
  for (let l of lAxes) {
    for (let r of rAxes) {
      let ln = cloneDeep(l)
      result.push(ln.intersect(r))
    }
  }

  return result
}

// 析取 or
// (A or B) or (C or D) = A or B or C or D
function disjunction(lAxes: MultiAxis[], rAxes: MultiAxis[]): MultiAxis[] {
  if (lAxes.length === 0 || rAxes.length === 0) {
    throw new Error("empty axes is not allowed")
  }

  return lAxes.concat(rAxes)
}

export function isLeaf(cond: Condition): cond is ConditionLeaf {
  return typeof cond[2] === "number"
}

export function toString(cond: Condition): string {
  if (isLeaf(cond)) {
    return _toString(cond)
  } else {
    let op: string
    switch (cond[1]) {
      case Relation.and:
        op = "and"
      case Relation.or:
        op = "or"
    }

    return `(${toString(cond[0])}) ${op} (${toString(cond[2] as Condition)})`
  }
}

function _toString(cond: Condition): string {
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
}
