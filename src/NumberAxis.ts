import { Condition, Predicate } from "./condition"

class IntervalSpace {
  interval: [number, number]
  isInclude: [boolean, boolean]

  constructor(min: number, max: number, isIncludeMin: boolean, isIncludeMax: boolean) {
    this.interval = [min, max]
    this.isInclude = [isIncludeMin, isIncludeMax]
  }
  static fromCondition(condition: Condition): IntervalSpace {
    // Condition is a root node
    if (typeof condition[0] === "string") {
      const [_, op, num] = condition
      return this.fromPredicate(op as Predicate, num as number)
    } else {
      throw new TypeError("condition must be a root node")
    }
  }
  static fromPredicate(op: Predicate, num: number): IntervalSpace {
    if (op == Predicate.eq) {
      return new IntervalSpace(num, num, true, true)
    }
    if (op == Predicate.lt) {
      return new IntervalSpace(-Infinity, num, false, false)
    }
    if (op == Predicate.le) {
      return new IntervalSpace(-Infinity, num, false, true)
    }
    if (op == Predicate.qt) {
      return new IntervalSpace(num, Infinity, false, false)
    }
    if (op == Predicate.qe) {
      return new IntervalSpace(num, Infinity, true, false)
    }
  }

  isContain(value: IntervalSpace): boolean {
    if (this.interval[0] < value.interval[0] && this.interval[1] > value.interval[1]) {
      return true
    }
    if (this.interval[0] == value.interval[0] && this.interval[1] > value.interval[1]) {
      if (this.isInclude[0]) {
        return true
      }
      if (!this.isInclude[0] && !value.isInclude[0]) {
        return true
      }
    }
    if (this.interval[0] < value.interval[0] && this.interval[1] == value.interval[1]) {
      if (this.isInclude[1]) {
        return true
      }
      if (!this.isInclude[1] && !value.isInclude[1]) {
        return true
      }
    }
    if (this.interval[0] == value.interval[0] && this.interval[1] == value.interval[1]) {
      if (this.isInclude[0] && this.isInclude[1]) {
        return true
      }
      if (value.isInclude == this.isInclude) {
        return true
      }
    }
    return false
  }

  isIntersect(value: IntervalSpace): boolean {
    if (this.interval[1] > value.interval[0] && this.interval[0] < value.interval[1]) {
      return true
    }
    if (this.interval[0] < value.interval[1] && this.interval[1] > value.interval[0]) {
      return true
    }
    if (this.interval[1] == value.interval[0]) {
      if (this.isInclude[1] || value.isInclude[0]) {
        return true
      }
    }
    if (this.interval[0] == value.interval[1]) {
      if (this.isInclude[0] || value.isInclude[1]) {
        return true
      }
    }
    return false
  }
  isNum(): boolean {
    return this.interval[0] == this.interval[1]
  }

  merge(value: IntervalSpace): IntervalSpace {
    const min = Math.min(this.interval[0], value.interval[0])
    const max = Math.max(this.interval[1], value.interval[1])
    const isIncludeMin = this.isInclude[0] || value.isInclude[0]
    const isIncludeMax = this.isInclude[1] || value.isInclude[1]
    return new IntervalSpace(min, max, isIncludeMin, isIncludeMax)
  }
}

export class NumberAxis {
  intervalSpaces: IntervalSpace[]

  constructor(intervalSpaces: IntervalSpace[] = []) {
    this.intervalSpaces = intervalSpaces
  }

  add(op: Predicate, num: number): NumberAxis {
    const newInterval = IntervalSpace.fromPredicate(op, num)

    // 检测this中的区间是否包含newInterval
    if (!this.isContainInterval(newInterval)) {
      // 检测newInterval中的区间是否包含this
      this.intervalSpaces.forEach((space, index) => {
        if (newInterval.isContain(space)) {
          this.intervalSpaces.splice(index, 1)
        }
      })

      const mergeIndex = this.mergeIndex(newInterval)
      if (mergeIndex !== -1) {
        this.intervalSpaces[mergeIndex] = this.intervalSpaces[mergeIndex].merge(newInterval)
      } else {
        this.intervalSpaces.push(newInterval)
      }
    }

    return this
  }

  isContainInterval(interval: IntervalSpace) {
    let res: boolean = false

    if (this.intervalSpaces.length === 0) return res

    this.intervalSpaces.forEach((space) => {
      if (space.isContain(interval)) {
        res = true
      }
    })

    return res
  }

  isContainAxis(axis: NumberAxis): boolean {
    let i = 0
    for (; i < axis.intervalSpaces.length; ) {
      for (let j = 0; j < this.intervalSpaces.length; j++) {
        if (this.intervalSpaces[j].isContain(axis.intervalSpaces[i])) {
          i++
        }
      }
    }

    if (i === axis.intervalSpaces.length) {
      return true
    }

    return false
  }

  mergeIndex(interval: IntervalSpace) {
    let res = -1

    this.intervalSpaces.forEach((space, index) => {
      if (space.isIntersect(interval)) {
        res = index
      }
    })

    return res
  }
}
