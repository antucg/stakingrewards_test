import { evaluate } from 'mathjs'
import { useEffect, useMemo, useState } from 'react'

import { CellData, Spreadsheet } from '../../@types/common'
import { useAppSelector } from '../redux/hooks/hooks'
import { getSpreadsheet } from '../redux/spreadsheet/spreadsheetSelector'
import { CellCoordinate, getCellReferencesFromExpression } from '../utils/dependencyGraph'
import { curateExpression, ERROR_VALUE, ERROR_CIRCULAR } from '../utils/expressions/utils'

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

  // Clean up expression
  const curatedExpression = useMemo(() => {
    if (maybeExpression.startsWith('=')) {
      return curateExpression(maybeExpression)
    }
    return maybeExpression
  }, [maybeExpression])

  // Get the list of referenced cells from the expression
  const referencedCells = useMemo(() => {
    if (maybeExpression.startsWith('=')) {
      return getCellReferencesFromExpression(curatedExpression, row, column)
    }
    return []
  }, [curatedExpression, maybeExpression, row, column])

  useEffect(() => {
    if (maybeExpression.startsWith('=') === true) {
      // If there is a dependency cycle let's display the error
      if (referencedCells === ERROR_CIRCULAR) {
        setValue(ERROR_CIRCULAR)
        return
      }

      // Get the values of the referenced cells
      const cellValues = getCellValues(referencedCells, spreadsheet)

      // Process expression interpolating variable values
      const result = processExpression(curatedExpression, cellValues)

      setValue(typeof result === 'number' ? result.toString() : result)
    } else {
      setValue(maybeExpression)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maybeExpression, row, column, curatedExpression, referencedCells, spreadsheet.version])

  return value || ''
}

export default useExpressionParser
