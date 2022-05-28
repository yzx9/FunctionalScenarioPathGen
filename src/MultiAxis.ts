import { NumberAxis } from "./NumberAxis"

import { setIntersection, setUnion } from "./setOperations"

export class MultiAxis {
  axisMap: Map<string, NumberAxis>
  constructor(axisMap: Map<string, NumberAxis> = new Map<string, NumberAxis>()) {
    this.axisMap = axisMap
  }

  static fromNumberAxis(key: string, axis: NumberAxis): MultiAxis {
    return new MultiAxis().set(key, axis)
  }

  union(axes: MultiAxis) {
    const allVariable = setUnion(this.keys, axes.keys)
    allVariable.forEach((key) => {
      if (this.has(key) && axes.has(key)) {
        this.set(key, this.get(key).unionAxis(axes.get(key)))
      }
      if (!this.has(key) && axes.has(key)) {
        this.set(key, axes.get(key))
      }
    })
    return this
  }

  intersect(axes: MultiAxis) {
    const allVariable = setIntersection(this.keys, axes.keys)
    this.axisMap.forEach((val, key) => {
      if (!allVariable.has(key)) {
        this.delete(key)
      } else {
        this.set(key, this.get(key).intersectAxis(axes.get(key)))
      }
    })
    return this
  }

  has(key: string): boolean {
    return this.axisMap.has(key)
  }

  get(key: string): NumberAxis {
    return this.axisMap.get(key)
  }

  set(key: string, axis: NumberAxis): MultiAxis {
    this.axisMap.set(key, axis)
    return this
  }

  delete(key: string): boolean {
    return this.axisMap.delete(key)
  }

  get keys(): Set<string> {
    return new Set([...this.axisMap.keys()])
  }

  get size(): number {
    return this.axisMap.size
  }

  toString(): string {
    let result: string = ""
    this.axisMap.forEach((v, k) => {
      result += `${k}:${v.toString()}`
    })
    return result
  }
}
