import { DepGraph, DepGraphCycleError } from 'dependency-graph'

export interface CellCoordinate {
  column: string
  row: number
}

let graph = new DepGraph<CellCoordinate>({ circular: true })

export const nodeIsInDependencyCycle = (node: string) => {
  const previousCircular = graph.circular
  let hasCycle = false
  try {
    // Small "hack" to check if there is a dependecy cycle when circular is set to true
    graph.circular = false
    graph.overallOrder()
  } catch (e) {
    if (e instanceof DepGraphCycleError) {
      hasCycle = e.cyclePath.includes(node)
    }
  }
  graph.circular = previousCircular
  return hasCycle
}

/**
 * Small helper fn to be used during the tests
 */
export const resetGraph = () => {
  graph = new DepGraph<CellCoordinate>({ circular: true })
}

/**
 * Given an expression, parse it, update the graph and return parent and children references (cells)
 */
export const getCellReferencesFromExpression = (
  expression: string,
  row: number,
  column: string,
): Array<CellCoordinate> => {
  const currentNode = `${column}${row}`

  /**
   * Extract all cell references
   * Eg: A1 + 2 + C3 => [[A1, A, 1, ...], [C3, C, 3]]
   */
  const matchResult = [...expression.matchAll(/([A-Z]+)(\d+)/g)]

  // Update dependencies, existing ones might have to be deleted or new ones added
  updateDependencyGraph(row, column, matchResult)

  // Return all parent and children nodes
  if (graph.hasNode(currentNode)) {
    const parentNodes = graph.dependentsOf(currentNode)
    const childrenNodes = graph.directDependenciesOf(currentNode)
    return getNodesData([...parentNodes, currentNode, ...childrenNodes])
  }
  return []
}

const updateDependencyGraph = (
  currentRow: number,
  currentColumn: string,
  referencedCells: Array<RegExpMatchArray>,
) => {
  const currentNode = `${currentColumn}${currentRow}`
  if (!graph.hasNode(currentNode)) {
    graph.addNode(currentNode)
    graph.setNodeData(currentNode, { column: currentColumn, row: currentRow })
  } else {
    // We remove all children dependencies ...
    const dependantNodes = graph.dependenciesOf(currentNode)
    dependantNodes.forEach(n => graph.removeDependency(currentNode, n))
  }

  // ... and now we recreate them (this way we don't have to calculate the diff)
  referencedCells.forEach(c => {
    const [_, column, row] = c

    if (column === undefined || row === undefined) {
      return
    }

    const curatedRow = Number(row)
    const node = `${column}${curatedRow}`

    if (!graph.hasNode(node)) {
      graph.addNode(node)
      graph.setNodeData(node, { column, row: curatedRow })
    }

    graph.addDependency(currentNode, node)
  })

  // If after updating all dependencies, the node is no longer referenced, let's remove it from
  // the graph
  if ([...graph.dependantsOf(currentNode), ...graph.dependenciesOf(currentNode)].length === 0) {
    graph.removeNode(currentNode)
  }
}

const getNodesData = (nodes: Array<string>) => nodes.map(n => graph.getNodeData(n))
