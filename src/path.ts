import { Process } from "./process"
import { Type, merge, isSubSet } from "./type"
import { divide, getArrangement, getFullArray } from "./utils"

type Connect = [
  string, // from
  string, // to
  [Type, Type][] // types, [from, to]
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

  const fromLayer = path.layers[path.layers.length - 2]
  const toLayer = path.layers[path.layers.length - 1]

  const fromTypes = new WeakMap<
    Type, // type in process 'from'
    [Process, Type][]
  >()
  for (let i = 0; i < fromLayer.length; i++) {
    for (let t of fromLayer[i].y) {
      if (!fromTypes.has(t)) fromTypes.set(t, [])
      fromTypes.get(t).push([fromLayer[i], t])
    }
  }

  const connectsArray: Connect[][] = []
  for (let to of toLayer) {
    for (let input of to.x) {
      let t = input
      while (!fromTypes.has(t)) t = t.getParent() // assert t in map

      connectsArray.push(fromTypes.get(t).map(([from, output]) => [from.id, to.id, [[output, input]]]))
    }
  }

  const typesFullArray = getFullArray(connectsArray.map((a) => a.length))
  const connectsStrage: Connect[][] = []
  for (let typesConnect of typesFullArray) {
    const connects: Connect[] = []
    for (let i = 0; i < typesConnect.length; i++) {
      connects.push(connectsArray[i][typesConnect[i]])
    }
    connectsStrage.push(connects)
  }

  return (path: Path) => {
    const paths: Path[] = []

    for (let connects of connectsStrage) {
      const newPath = path.copy()
      const map = new Map<string, Connect>() // merge vars
      for (let [from, to, [t]] of connects) {
        const key = `${from}->${to}`
        if (map.has(key)) {
          map.get(key)[2].push(t)
        } else {
          map.set(key, [from, to, [t]])
        }
      }

      newPath.connects.push(...map.values())
      paths.push(newPath)
    }

    return paths
  }
}
