export class Type {
  name: string

  constructor(name: string)
  constructor(parent: Type, name: string)
  constructor(parent: string | Type, name?: string) {
    let typeName: string
    if (typeof parent === "object") {
      typeName = parent.name + ", " + name
    } else {
      typeName = parent
    }

    this.name = typeName
  }

  canBeType(type: Type): boolean {
    return this.name.startsWith(type.name)
  }
}

export function merge(...types: Type[][]): Type[] {
  const set = new Map<string, Type>(types.flat().map((a) => [a.name, a]))
  return Array.from(set.values())
}

/**
 * 判断 A 是否为 B 的子集
 */
export function isSubSet(setA: Type[], setB: Type[]): boolean {
  return setA.every((a) => setB.some((c) => a.canBeType(c)))
}

export const Int = new Type("Int")
export const PositiveInt = new Type(Int, "PositiveInt")

export const Str = new Type("String")
export const Account = new Type(Str, "Account")
export const Password = new Type(Str, "Password")

export const Money = new Type("Money")
export const RMB = new Type(Money, "RMB")

export const Bool = new Type("Boolean")
