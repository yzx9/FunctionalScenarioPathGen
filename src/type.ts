export enum Predicate {
  eq,
  lt,
  le,
  qt,
  qe,
}

export enum Relation {
  and,
  or,
}

export type Type = {
  name: string

  compare(op: Predicate, x: Type): boolean

  canBeType(type: Type): boolean

  asType<T extends Type>(type: T): T | null

  copy<T>(this: T): Type
}

export class TypeBase {
  name: string

  canBeType(type: Type): boolean {
    return this.name.startsWith(type.name)
  }

  asType<T extends Type>(type: T): T | null {
    if (!this.canBeType(type)) return null

    return
  }
}

export class Int extends TypeBase {
  value: number

  constructor(value: number) {
    super()
    this.name = "Int"
    this.value = Math.floor(value)
  }

  copy(): Int {
    return new Int(this.value)
  }

  compare(op: Predicate, x: Type): boolean {
    const int = x.asType<Int>(this)
    if (int == null) {
      throw new TypeError()
    }

    switch (op) {
      case Predicate.eq:
        return this.value === int.value

      case Predicate.lt:
        return this.value < int.value

      case Predicate.le:
        return this.value <= int.value

      case Predicate.qt:
        return this.value > int.value

      case Predicate.qe:
        return this.value >= int.value

      default:
        throw new TypeError()
    }
  }
}

export class PositiveInt extends Int {
  constructor(value: number) {
    super(value)
    this.name = "Int, PositiveInt"

    if (this.value <= 0) {
      throw TypeError()
    }
  }
}
