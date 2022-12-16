import { evaluate } from 'mathjs'
import { useEffect, useState } from 'react'

import { CellData, Spreadsheet } from '../../@types/common'
import { useAppSelector } from '../redux/hooks/hooks'
import { getSpreadsheet } from '../redux/spreadsheet/spreadsheetSelector'
import { CellCoordinate, getCellReferencesFromExpression } from '../utils/dependencyGraph'
import { curateExpression, ERROR_VALUE } from '../utils/expressions/utils'

const processExpression = (expression: string, variables: Record<string, CellData> = {}) => {
  try {
    return evaluate(expression, variables)
  } catch (e) {
    return ERROR_VALUE
  }
}

export const getCellValues = (cells: Array<CellCoordinate>, spreadsheet: Spreadsheet) =>
  cells.reduce((acc, current) => {
    const variableName = `${current.column}${current.row}`
    acc[variableName] =
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      spreadsheet.rows[current.row]?.columns[current.column]?.value || ''
    return acc
  }, {} as Record<string, CellData>)

const useExpressionParser = (maybeExpression: CellData, row: number, column: string) => {
  const [value, setValue] = useState(maybeExpression)
  const spreadsheet = useAppSelector(getSpreadsheet)

  useEffect(() => {
    if (maybeExpression === '') {
      setValue('')
    } else if (maybeExpression.startsWith('=') === true) {
      // Clean up expression
      const curatedExpression = curateExpression(maybeExpression)

      // Get the list of referenced cells from the expression
      const referencedCells = getCellReferencesFromExpression(curatedExpression, row, column)

      // Get the values of the referenced cells
      const cellValues = getCellValues(referencedCells, spreadsheet)

      // Process expression interpolating variable values
      const result = processExpression(curatedExpression, cellValues)

      setValue(typeof result === 'number' ? result.toString() : result)
    } else {
      setValue(maybeExpression)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maybeExpression, row, column, spreadsheet.version])

  return value || ''
}

export default useExpressionParser
