import { CellData } from '../../../@types/common'
import { CellCoordinate } from '../../utils/dependencyGraph'
import { ERROR_VALUE } from '../../utils/expressions/utils'
import { RootState } from '../store'

export const getSpreadsheet = ({ spreadsheet }: RootState) => spreadsheet.data

export const getFilteredSpreadsheet = ({ spreadsheet }: RootState) => {
  if (spreadsheet.data.rows.length === 0 || spreadsheet.filterQuery === '') {
    return spreadsheet.data
  }

  const spreadsheetColumns = Object.keys(spreadsheet.data.rows[0]!.columns)
  return {
    version: spreadsheet.data.version,
    rows: spreadsheet.data.rows.filter(r =>
      spreadsheetColumns.some(column => r.columns[column]?.value === spreadsheet.filterQuery),
    ),
  }
}

export const getSpreadsheetHeaders = ({ spreadsheet }: RootState) => {
  if (spreadsheet.data.rows.length === 0) {
    return []
  }
  const firstRowColumns =
    spreadsheet.data.rows[0]?.columns !== undefined ? spreadsheet.data.rows[0]?.columns : {}
  return Object.keys(firstRowColumns)
}

export const getStatus = ({ spreadsheet }: RootState) => spreadsheet.status

export const getErrorMessage = ({ spreadsheet }: RootState) => spreadsheet.errorMessage

export const getCellValues = (cells: Array<CellCoordinate>) => (state: RootState) =>
  cells.reduce((acc, current) => {
    const variableName = `${current.column}${current.row}`
    acc[variableName] =
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      state.spreadsheet.data.rows[current.row]?.columns[current.column]?.value || ERROR_VALUE
    return acc
  }, {} as Record<string, CellData>)

export const getProgressData = ({ spreadsheet }: RootState) => spreadsheet.progressData
