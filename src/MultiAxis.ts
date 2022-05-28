import { NumberAxis } from "./NumberAxis"
import { ConditionLeaf } from "./condition"
import { isSuperset, setUnion } from "./setOperations"

export class MultiAxis {
  axisMap: Map<string, NumberAxis>
  constructor(axisMap: Map<string, NumberAxis> = new Map<string, NumberAxis>()) {
    this.axisMap = axisMap
  }

  static fromNumberAxis(key: string, axis: NumberAxis): MultiAxis {
    return new MultiAxis().set(key, axis)
  }

  static fromCondition(cond: ConditionLeaf): MultiAxis {
    return new MultiAxis().set(cond[0], new NumberAxis().union(cond[1], cond[2]))
  }

  union(axes: MultiAxis): MultiAxis {
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

  intersect(axes: MultiAxis): MultiAxis {
    const allVariable = setUnion(this.keys, axes.keys)
    allVariable.forEach((key) => {
      if (this.has(key) && axes.has(key)) {
        this.set(key, this.get(key).intersectAxis(axes.get(key)))
      }
      if (!this.has(key) && axes.has(key)) {
        this.set(key, axes.get(key))
      }
    })
    return this
  }

  isSuperAxis(axes: MultiAxis): boolean {
    if (!isSuperset(this.keys, axes.keys)) {
      return false
    }
    axes.axisMap.forEach((val, key) => {
      if (!this.get(key).isContainAxis(val)) {
        return false
      }
    })
    return true
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
