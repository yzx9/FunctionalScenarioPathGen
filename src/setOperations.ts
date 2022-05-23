export function isSuperset<T>(set: Set<T>, subset: Set<T>) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false
    }
  }
  return true
}
export function intersection<T>(setA: Set<T>, setB: Set<T>) {
  let _intersection = new Set<T>()
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}
