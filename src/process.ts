import { Condition } from "./condition"
import { Type } from "./type"

export class Process {
  id: string

  x: Type[]
  y: Type[]

  pre: Condition | null
  post: Condition | null

  constructor(
    id: string,
    x: Type[],
    y: Type[],
    pre: Condition | null = null,
    post: Condition | null = null
  ) {
    this.id = id
    this.x = x
    this.y = y
    this.pre = pre
    this.post = post
  }
}
