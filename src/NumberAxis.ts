import { Condition, Predicate } from "./condition"

class IntervalSpace {
  interval: [number, number]
  isInclude: [boolean, boolean]

  constructor(interval: [number, number], isInclude: [boolean, boolean]) {
    this.interval = interval
    this.isInclude = isInclude
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
      return new IntervalSpace([num, num], [true, true])
    }
    if (op == Predicate.lt) {
      return new IntervalSpace([-Infinity, num], [false, false])
    }
    if (op == Predicate.le) {
      return new IntervalSpace([-Infinity, num], [false, true])
    }
    if (op == Predicate.qt) {
      return new IntervalSpace([num, Infinity], [false, false])
    }
    if (op == Predicate.qe) {
      return new IntervalSpace([num, Infinity], [true, false])
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
      if (this.isInclude[0] && this.isInclude[1] == value.isInclude[1]) {
        return true
      }
      if (this.isInclude[1] && this.isInclude[0] == value.isInclude[0]) {
        return true
      }
      if (this.isInclude[0] == value.isInclude[0] && this.isInclude[1] == value.isInclude[1]) {
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
    const interval: [number, number] = [-Infinity, Infinity]
    const isInclude: [boolean, boolean] = [false, false]

    interval[0] = Math.min(this.interval[0], value.interval[0])
    if (interval[0] == this.interval[0] && interval[0] == value.interval[0]) {
      isInclude[0] = this.isInclude[0] || value.isInclude[0]
    } else if (interval[0] == this.interval[0]) {
      isInclude[0] = this.isInclude[0]
    } else {
      isInclude[0] = value.isInclude[0]
    }

    interval[1] = Math.max(this.interval[1], value.interval[1])
    if (interval[1] == this.interval[1] && interval[1] == value.interval[1]) {
      isInclude[1] = this.isInclude[1] || value.isInclude[1]
    } else if (interval[1] == this.interval[1]) {
      isInclude[1] = this.isInclude[1]
    } else {
      isInclude[1] = value.isInclude[1]
    }

    return new IntervalSpace(interval, isInclude)
  }

  toString() {
    const left = this.isInclude[0] ? "[" : "("
    const right = this.isInclude[1] ? "]" : ")"
    return `${left}${this.interval[0]},${this.interval[1]}${right}`
  }
}

export class NumberAxis {
  intervalSpaces: IntervalSpace[]

  constructor(intervalSpaces: IntervalSpace[] = []) {
    this.intervalSpaces = intervalSpaces
  }
  add(op: Predicate, num: number): NumberAxis {
    // TODO
    return this.union(op, num)
  }

  union(op: Predicate, num: number): NumberAxis {
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

  intersect(op: Predicate, num: number): NumberAxis {
    const newInterval = IntervalSpace.fromPredicate(op, num)
    // TODO
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
      let flag: boolean = false
      for (let j = 0; j < this.intervalSpaces.length; j++) {
        if (this.intervalSpaces[j].isContain(axis.intervalSpaces[i])) {
          i++
          flag = true
        }
      }
      if (!flag) break
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

  toString() {
    return this.intervalSpaces.toString()
  }
}
