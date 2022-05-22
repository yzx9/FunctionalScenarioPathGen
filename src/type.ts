export class Type {
  name: string

  constructor(name: string)
  constructor(parent: Type, name: string)
  constructor(parent: string | Type, name?: string) {
    let typeName: string
    if (typeof parent == "string") {
      typeName = parent + ", " + name
    } else {
      typeName = name
    }

    this.name = typeName
  }

  canBeType(type: Type): boolean {
    return this.name.startsWith(type.name)
  }
}

export function merge(...types: Type[][]): Type[] {
  const set = new Set<Type>()
  for (let a of types) {
    for (let b of a) {
      set.add(b)
    }
  }

  return Array.from(set)
}

/**
 * 判断 A 是否为 B 的子集
 */
export function isSubSet(a: Type[], b: Type[]): boolean {
  const setB = new Set<Type>()
  for (let bb of b) {
    setB.add(bb)
  }

  for (let aa of a) {
    if (!setB.has(aa)) {
      return false
    }
  }

  return true
}

export const Int = new Type("Int")
export const PositiveInt = new Type(Int, "PositiveInt")

export const Str = new Type("String")
export const Account = new Type(Str, "Account")
export const Password = new Type(Str, "Password")
