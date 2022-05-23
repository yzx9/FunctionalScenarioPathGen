import { Process } from "./process"
import { Type, merge, isSubSet } from "./type"
import { divide, getFullArray } from "./utils"

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
    for (let indexs of getFullArray(processes.length, i)) {
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

      if (lastPath.layers.length) {
        const genRoutes = genPathRoutes(
          path.layers[path.layers.length - 2],
          path.layers[path.layers.length - 1]
        )

        paths.push(...subpaths.map(genRoutes).flat())
      } else {
        paths.push(...subpaths)
      }
    }
  }

  return paths
}

function genPathRoutes(from: Process[], to: Process[]): (path: Path) => Path[] {
  // TODO swith route
  return (path: Path) => [path]
}
