export function isSuperset<T>(set: Set<T>, subset: Set<T>) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false
    }
  }
  return true
}
export function setIntersection<T>(setA: Set<T>, setB: Set<T>) {
  let _intersection = new Set<T>()
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}
export function setUnion<T>(setA: Set<T>, setB: Set<T>) {
  let _union = new Set<T>()
  for (let elem of setA) {
    _union.add(elem)
  }
  for (let elem of setB) {
    _union.add(elem)
  }
  return _union
}
