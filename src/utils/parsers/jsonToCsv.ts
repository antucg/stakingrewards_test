import { parse } from 'json2csv'

import { Spreadsheet } from '../../../@types/common'

/**
 * Given a spreadsheet (JSON), formats it as a CSV string
 */
export default (data: Spreadsheet, delimiter = ',') => {
  let rowsData
  if (data.rows.length === 0) {
    rowsData = [{}]
  } else {
    const columnNames = Object.keys(data.rows[0]!.columns)
    rowsData = data.rows.map(r =>
      columnNames.reduce((acc, current) => {
        acc[current] = r.columns[current]!.data
        return acc
      }, {} as Record<string, string>),
    )
  }

  return parse(rowsData, { delimiter })
}
