export type CellData = string

export interface SpreadsheetCell {
  value: CellData
  data: CellData
}

export interface SpreadsheetColumn {
  [header: string]: SpreadsheetCell
}

export interface SpreadsheetRow {
  idx: number
  key: string
  columns: SpreadsheetColumn
}

export interface Spreadsheet {
  rows: Array<SpreadsheetRow>
  version: number
}

export type JsonCsv = Array<Record<string, CellData>>

export interface ProgressData {
  id: string | null
  done_at: string | null
}
