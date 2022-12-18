import { evaluate } from 'mathjs'

import { CellData, SpreadsheetRow } from '../../../@types/common'
import {
  getCellReferencesFromExpression,
  nodeIsInDependencyCycle,
} from '../../utils/dependencyGraph'
import { ERROR_CIRCULAR, ERROR_VALUE } from '../../utils/expressions/utils'

export const updateSpreadsheet = (
  maybeExpression: string,
  row: number,
  column: string,
  spreadsheet: Array<SpreadsheetRow>,
): Array<{ row: number; column: string; value: string }> => {
  const node = `${column}${row}`

  // Parent and children of current node
  const referencedCells = getCellReferencesFromExpression(maybeExpression, row, column)

  // The node is in a dependecy cycle, let's update the whole "chain" with proper error
  if (nodeIsInDependencyCycle(node)) {
    return referencedCells
      .slice(1)
      .map(({ row, column }) => ({ row, column, value: ERROR_CIRCULAR }))
  }

  // No cells are referenced, let's process the expression
  if (referencedCells.length === 0) {
    return [
      {
        row,
        column,
        value: processNode({ expression: maybeExpression }),
      },
    ]
  }

  const variables: Record<string, CellData> = {}
  const updatedCells = []
  const currentIndex = referencedCells.findIndex(rc => rc.column === column && rc.row === row)

  // Children nodes don't have to be computed, let's extract them as variables
  for (let i = referencedCells.length - 1; i > currentIndex; i -= 1) {
    const { row, column } = referencedCells[i]!
    const { value } = spreadsheet[row]!.columns[column]!
    variables[`${column}${row}`] = value
  }

  // Compute current and parent nodes
  for (let i = currentIndex; i >= 0; i -= 1) {
    const { row: referencedRow, column: referencedColumn } = referencedCells[i]!
    const { data, value } = spreadsheet[referencedRow]!.columns[referencedColumn]!

    const newValue = processNode({
      expression: data,
      variables,
    })

    if (newValue !== value) {
      updatedCells.push({
        row: referencedRow,
        column: referencedColumn,
        value: newValue,
      })
    }
    variables[`${referencedColumn}${referencedRow}`] = newValue
  }
  return updatedCells
}

const processNode = ({
  expression,
  variables = {},
}: {
  expression: string
  variables?: Record<string, CellData>
}) => {
  if (expression.startsWith('=')) {
    return processMathematicalExpression(expression, variables)
  }
  return expression
}

const processMathematicalExpression = (
  expression: string,
  variables: Record<string, CellData> = {},
) => {
  try {
    return evaluate(expression.replace('=', ''), variables).toString()
  } catch (e) {
    return ERROR_VALUE
  }
}
