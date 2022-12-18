import { CellCoordinate } from '../../utils/dependencyGraph'
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

export const getCellValue = (cell: CellCoordinate) => (state: RootState) =>
  state.spreadsheet.data.rows[cell.row]?.columns[cell.column]?.value || ''

export const getProgressData = ({ spreadsheet }: RootState) => spreadsheet.progressData
