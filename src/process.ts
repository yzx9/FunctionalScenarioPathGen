import { Condition } from "./condition"
import { Type } from "./type"

export class Process {
  id: string

  pre: Condition[]
  post: Condition[]

  x: Type[]
  y: Type[]

  constructor(
    id: string,
    pre: Condition[],
    post: Condition[],
    x: Type[],
    y: Type[]
  ) {
    this.id = id
    this.pre = pre
    this.post = post
    this.x = x
    this.y = y
  }
}
