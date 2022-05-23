import { Process } from "./process"
import { Type, merge, isSubSet } from "./type"
import { divide, getArrangement, getFullArray } from "./utils"

export class Path {
  processes: Process[]
  adjacencyMatrix: boolean[][]
  layers: Process[][]

  constructor(processes: Process[]) {
    this.processes = processes
    this.adjacencyMatrix = [
      ...Array(processes.length)
        .fill(0)
        .map((_) => [...Array(processes.length).fill(false)]),
    ]
    this.layers = []
  }

  copy(): Path {
    const path = new Path(this.processes)
    path.adjacencyMatrix = this.adjacencyMatrix.map((a) => a.map((b) => b))
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
 * @param lastOutputs 上一级的输出
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

      const subpaths = genPathLayer(path, notUsed)
      const writeRoutes = genPathRoutes(path)
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

  const indexOfTypeFroms = new Map<string, number[]>() // from type to process `from`
  for (let i = 0; i < from.length; i++) {
    for (let t of from[i].y) {
      if (!indexOfTypeFroms.has(t.name)) indexOfTypeFroms.set(t.name, [])
      indexOfTypeFroms.get(t.name).push(i)
    }
  }

  const connectsFullArray: [
    number, // index of from process
    number // index of to process
  ][][] = []
  for (let toIndex = 0; toIndex < to.length; toIndex++) {
    for (let x of to[toIndex].x) {
      const froms = indexOfTypeFroms.get(x.name)
      connectsFullArray.push(froms.map((fromIndex) => [fromIndex, toIndex]))
    }
  }

  // TODO swith route
  const typesFullArray = getFullArray(connectsFullArray.map((a) => a.length))
  const connectsArray: [number, number][][] = [[[0, 0]]]
  for (let typesConnect of typesFullArray) {
  }

  return (path: Path) => {
    const paths: Path[] = []

    for (let connects of connectsArray) {
      const newPath = path.copy()
      for (let [from, to] of connects) path.adjacencyMatrix[from][to] = true
      paths.push(newPath)
    }

    return paths
  }
}
