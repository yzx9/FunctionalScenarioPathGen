import { Condition } from "./condition"
import { Type } from "./type"

export type Process = {
  id: string

  pre: Condition[]
  post: Condition[]

  x: Type[][]
  y: Type[][]
}
