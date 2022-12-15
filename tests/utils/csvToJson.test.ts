import csvToJson from '../../src/utils/parsers/csvToJson'
import corruptedCsvData from '../data/corruptedCsvData.json'
import csvData from '../data/csvData.json'

describe('csvToJson test', () => {
  const headers = ['A', 'B', 'C']

  it('should parse good CSV to JSON', async () => {
    expect(await csvToJson(csvData.csv, headers)).toBeTruthy()
  })

  it('should throw error when parsing a corrupted csv', async () => {
    expect.assertions(1)
    try {
      await csvToJson(corruptedCsvData.csv, headers)
      throw new Error("Shouldn't reach here")
    } catch (e) {
      expect(e).toBeTruthy()
    }
  })
})
