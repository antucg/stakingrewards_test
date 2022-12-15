import csvToJson from '../../src/utils/parsers/csvToJson'
import isValidJson from '../../src/utils/parsers/jsonCsvValidator'
import csvData from '../data/csvData.json'
import invalidCsvData from '../data/invalidCsvData.json'

describe('jsonCsvValidator test', () => {
  const headers = ['A', 'B', 'C']

  it('should succeed validating good JSON parsed data', async () => {
    const json = await csvToJson(csvData.csv, headers)
    expect(isValidJson(json, ['A', 'B', 'C'])).toBe(true)
  })

  it('should fail to validate good JSON with missing columns', async () => {
    const json = await csvToJson(invalidCsvData.csv, headers)
    expect(isValidJson(json, ['A', 'B', 'C'])).toBe(false)
  })
})
