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
}

export function genFuntionalScenarioPaths(processes: Process[]): Path[] {
  const paths: Path[] = []

  for (let i = 1; i <= processes.length; i++) {
    const fullArray = getFullArray(processes.length, i)

    for (let notUsedIndexs of fullArray) {
      const [notUsed, used] = divide(processes, notUsedIndexs)

      const path = new Path(processes)
      path.layers.push(used)

      // let inputs = merge(...pro.map((a) => a.x))
      const outputs = merge(...used.map((a) => a.y))
      const subpaths = genPathLayer(path, outputs, notUsed)
      paths.push(...subpaths)
    }
  }

  return paths
}

/**
 *
 * @param lastPath 上一级的Path
 * @param lastOutputs 上一级的输出
 * @param processes 可用的Process
 * @returns
 */
function genPathLayer(
  lastPath: Path,
  lastOutputs: Type[],
  processes: Process[]
): Path[] {
  const paths = []
  for (let i = 0; i < processes.length; i++) {
    let fullArray = getFullArray(processes.length, i)

    for (let notUsedIndexs of fullArray) {
      const [notUsed, used] = divide(processes, notUsedIndexs)
      const inputs = merge(...used.map((a) => a.x))
      if (!isSubSet(inputs, lastOutputs)) {
        // this is invalid path, notes that this is not about validity
        continue
      }

      const path = lastPath.copy()
      path.layers.push(used)

      const outputs = merge(...used.map((a) => a.y))
      // TODO: update path

      const subpaths = genPathLayer(path, outputs, notUsed)
      paths.push(...subpaths)
    }
  }

  return paths
}
