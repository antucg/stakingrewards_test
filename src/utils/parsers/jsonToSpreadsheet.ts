import { v4 as uuidv4 } from 'uuid'

import { JsonCsv, Spreadsheet } from '../../../@types/common'

/**
 * Given an array of JSON objects from a CSV, adds a unique id to each row and converts cells to
 * {{ data, value }} objects
 */
export default (rows: JsonCsv): Spreadsheet => ({
  rows: rows.map((r, i) => ({
    idx: i,
    key: uuidv4(),
    columns: Object.keys(r).reduce((acc, current) => {
      acc[current] = {
        data: r[current],
        value: r[current],
      }
      return acc
      // TODO: verify type here
    }, {} as any),
  })),
  version: 1,
})
