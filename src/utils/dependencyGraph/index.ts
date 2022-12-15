import { DepGraph } from 'dependency-graph'

export interface CellCoordinate {
  column: string
  row: number
}

let graph = new DepGraph<CellCoordinate>()

export const resetGraph = () => {
  graph = new DepGraph<CellCoordinate>()
}

/**
 * Given an expression, parse it, update the graph and return parent and children references (cells)
 */
export const getCellReferencesFromExpression = (
  expression: string,
  row: number,
  column: string,
) => {
  if (expression === '') {
    return []
  }

  const currentNode = `${column}${row}`

  /**
   * Extract all cell references
   * Eg: A1 + 2 + C3 => [[A1, A, 1, ...], [C3, C, 3]]
   */
  const matchResult = [...expression.matchAll(/([A-Z]+)(\d+)/g)]

  // Update dependencies, existing ones might have to be deleted or new ones added
  updateDependencyGraph(row, column, matchResult)

  // Return all parent and children nodes
  return graph.hasNode(currentNode)
    ? getNodesData([...graph.dependantsOf(currentNode), ...graph.dependenciesOf(currentNode)])
    : []
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