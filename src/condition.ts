import { Type, Predicate, Relation } from "./type"

export type Condition =
  | [Type, Predicate, Type]
  | [Condition, Relation, Condition]
