import { Process } from "./process"
import { Type, merge, isSubSet } from "./type"
import { divide, getArrangement, getFullArray } from "./utils"

type Connect = [
  string, // from
  string, // to
  Type[] // types
]

export class Path {
  processes: Process[]
  connects: Connect[]
  layers: Process[][]

  constructor(processes: Process[]) {
    this.processes = processes
    this.connects = []
    this.layers = []
  }

  copy(): Path {
    const path = new Path(this.processes)
    path.connects = [...this.connects]
    path.layers = this.layers.map((a) => a.map((b) => b))
    return path
  }

  toString(): string {
    return JSON.stringify(this.layers.map((a) => a.map((b) => b.id)))
  }
}

export function genFuntionalScenarioPaths(processes: Process[]): Path[] {
  const path = new Path(processes)
  return genPathLayer(path, processes)
}

/**
 *
 * @param lastPath 上一级的Path
 * @param processes 可用的Process
 * @returns
 */
function genPathLayer(lastPath: Path, processes: Process[]): Path[] {
  if (processes.length == 0) return [lastPath]

  const paths = []
  for (let i = 1; i <= processes.length; i++) {
    for (let indexs of getArrangement(processes.length, i)) {
      const [used, notUsed] = divide(processes, indexs)
      const inputs = merge(...used.map((a) => a.x))

      if (lastPath.layers.length) {
        const lastLayer = lastPath.layers[lastPath.layers.length - 1]
        const lastOutputs = merge(...lastLayer.map((a) => a.y))
        if (!isSubSet(inputs, lastOutputs)) {
          // this is not an available path
          continue
        }
      }

      const path = lastPath.copy()
      path.layers.push(used)
      const writeRoutes = genPathRoutes(path)

      const subpaths = genPathLayer(path, notUsed)
      paths.push(...subpaths.map(writeRoutes).flat())
    }
  }

  return paths
}

function genPathRoutes(path: Path): (path: Path) => Path[] {
  if (path.layers.length <= 1) {
    return (path: Path) => [path]
  }

  const from = path.layers[path.layers.length - 2]
  const to = path.layers[path.layers.length - 1]

  const indexOfTypeFrom = new Map<string, number[]>() // from type to process `from`
  for (let i = 0; i < from.length; i++) {
    for (let t of from[i].y) {
      if (!indexOfTypeFrom.has(t.name)) indexOfTypeFrom.set(t.name, [])
      indexOfTypeFrom.get(t.name).push(i)
    }
  }

  const connectsFullArray: Connect[][] = []
  for (let toIndex = 0; toIndex < to.length; toIndex++) {
    for (let x of to[toIndex].x) {
      const froms = indexOfTypeFrom.get(x.name)
      connectsFullArray.push(froms.map((fromIndex) => [from[fromIndex].id, to[toIndex].id, [x]]))
    }
  }

  const typesFullArray = getFullArray(connectsFullArray.map((a) => a.length))
  const connectsArray: Connect[][] = []
  for (let typesConnect of typesFullArray) {
    const connects: Connect[] = []
    for (let i = 0; i < typesConnect.length; i++) {
      connects.push(connectsFullArray[i][typesConnect[i]])
    }
    connectsArray.push(connects)
  }

  return (path: Path) => {
    const paths: Path[] = []

    for (let connects of connectsArray) {
      const newPath = path.copy()
      const map = new Map<string, Connect>()
      for (let [from, to, [t]] of connects) {
        const key = `${from}->${to}`
        if (map.has(key)) {
          const connect = map.get(key)
          connect[2].push(t)
        } else {
          map.set(key, [from, to, [t]])
        }
      }

      for (let [_, connect] of map) {
        path.connects.push(connect)
      }
      paths.push(newPath)
    }

    return paths
  }
}
