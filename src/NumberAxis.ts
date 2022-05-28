import { Condition, Predicate } from "./condition"

class IntervalSpace {
  interval: [number, number]
  isInclude: [boolean, boolean]

  constructor(interval: [number, number], isInclude: [boolean, boolean]) {
    this.interval = interval
    this.isInclude = isInclude
  }

  /**
   * 从Condition构造区间，Condition必须为根节点
   */
  static fromCondition(condition: Condition): IntervalSpace {
    // Condition is a root node
    if (typeof condition[0] === "string") {
      const [_, op, num] = condition
      return this.fromPredicate(op as Predicate, num as number)
    } else {
      throw new TypeError("condition must be a root node")
    }
  }

  /**
   * 从操作符构造区间
   */
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

  isSuperInterval(value: IntervalSpace): boolean {
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

  hasCommonSpan(value: IntervalSpace): boolean {
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

  union(value: IntervalSpace): IntervalSpace {
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

  intersect(value: IntervalSpace): IntervalSpace {
    const interval: [number, number] = [-Infinity, Infinity]
    const isInclude: [boolean, boolean] = [false, false]

    interval[0] = Math.max(this.interval[0], value.interval[0])
    if (interval[0] == this.interval[0] && interval[0] == value.interval[0]) {
      isInclude[0] = this.isInclude[0] && value.isInclude[0]
    } else if (interval[0] == this.interval[0]) {
      isInclude[0] = this.isInclude[0]
    } else {
      isInclude[0] = value.isInclude[0]
    }

    interval[1] = Math.min(this.interval[1], value.interval[1])
    if (interval[1] == this.interval[1] && interval[1] == value.interval[1]) {
      isInclude[1] = this.isInclude[1] && value.isInclude[1]
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

  // 并集
  union(op: Predicate, num: number): NumberAxis {
    const newInterval = IntervalSpace.fromPredicate(op, num)
    this._union(newInterval)
    return this
  }

  unionAxis(axis: NumberAxis): NumberAxis {
    axis.intervalSpaces.forEach((val) => {
      this._union(val)
    })
    return this
  }

  _union(interval: IntervalSpace): void {
    // 检测this中的区间是否包含newInterval
    if (!this.isContain(interval)) {
      // 检测newInterval中的区间是否包含this
      this.intervalSpaces.forEach((space, index) => {
        if (interval.isSuperInterval(space)) {
          // 包含则删除
          this.intervalSpaces.splice(index, 1)
        }
      })

      // 检测newInterval中的区间是否与this交叉
      if (this.hasCommonSpan(interval)) {
        // 交叉则合并
        const unionIndex = this.commonSpanIndex(interval)
        this.intervalSpaces[unionIndex] = this.intervalSpaces[unionIndex].union(interval)
      } else {
        this.intervalSpaces.push(interval)
      }
    }
  }

  // 交集
  intersect(op: Predicate, num: number): NumberAxis {
    const newInterval = IntervalSpace.fromPredicate(op, num)
    this._intersect(newInterval)
    return this
  }

  intersectAxis(axis: NumberAxis): NumberAxis {
    axis.intervalSpaces.forEach((val) => {
      this._intersect(val)
    })
    return this
  }

  _intersect(interval: IntervalSpace): void {
    // 检测this中的区间是否包含newInterval
    if (this.isContain(interval)) {
      // 若包含则清空数轴上所有区间
      this.intervalSpaces = [interval]
    } else {
      // 不包含则尝试取交集
      if (this.hasCommonSpan(interval)) {
        const intersectIndex = this.commonSpanIndex(interval)
        this.intervalSpaces[intersectIndex] = this.intervalSpaces[intersectIndex].intersect(interval)
      } else {
        this.intervalSpaces = []
      }
    }
  }

  isContain(interval: IntervalSpace) {
    return this.intervalSpaces.some((item) => {
      return item.isSuperInterval(interval)
    })
  }

  isContainAxis(axis: NumberAxis): boolean {
    let i = 0
    for (; i < axis.intervalSpaces.length; ) {
      let flag: boolean = false
      for (let j = 0; j < this.intervalSpaces.length; j++) {
        if (this.intervalSpaces[j].isSuperInterval(axis.intervalSpaces[i])) {
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

  hasCommonSpan(interval: IntervalSpace) {
    return this.intervalSpaces.some((item) => {
      return item.hasCommonSpan(interval)
    })
  }

  commonSpanIndex(interval: IntervalSpace) {
    let res = -1

    this.intervalSpaces.forEach((space, index) => {
      if (space.hasCommonSpan(interval)) {
        res = index
      }
    })

    return res
  }

  toString() {
    return this.intervalSpaces.toString()
  }
}
