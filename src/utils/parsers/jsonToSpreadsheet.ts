import { v4 as uuidv4 } from 'uuid'

import { JsonCsv, Spreadsheet, SpreadsheetCell } from '../../../@types/common'

/**
 * Given an array of JSON objects from a CSV, adds a unique key and an id to each row.
 * Converts cells to {{ data, value }} objects as well.
 */
export default (rows: JsonCsv): Spreadsheet => {
  if (rows.length === 0) {
    return {
      headers: [],
      rows: [],
      version: 1,
    }
  }

  const headers = Object.keys(rows[0]!)
  return {
    headers,
    rows: rows.map((r, i) => ({
      idx: i,
      key: uuidv4(),
      columns: headers.reduce((acc, current) => {
        acc[current] = {
          data: r[current] || '',
          value: r[current] || '',
        }
        return acc
      }, {} as Record<string, SpreadsheetCell>),
    })),
    version: 1,
  }
}
