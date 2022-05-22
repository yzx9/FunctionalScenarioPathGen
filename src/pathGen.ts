import { Process } from "./process"
import { Type, merge, isSubSet } from "./type"

export class Path {
  processes: Process[]
  adjacencyMatrix: boolean[][]

  constructor(processes: Process[]) {
    this.processes = processes
    this.adjacencyMatrix = [
      ...Array(processes.length)
        .fill(0)
        .map((_) => [...Array(processes.length).fill(false)]),
    ]
  }
}

export function genFuntionalScenarioPaths(processes: Process[]): Path[] {
  const paths = []

  for (let i = 0; i < processes.length; i++) {
    let inputs: Type[][] = []
    let input = merge(...inputs)

    let output: Type[] = []
    if (!isSubSet(output, input)) {
      // this is invalid path, notes that this is not about validity
    }

    // put valid path
    // gen next level nodes
  }

  return paths
}
