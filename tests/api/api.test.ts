import { getCSVData } from '../../src/api'

describe('API test', () => {
  it('should parse mock CSV data and return it as JSON', async () => {
    const parsedCSV = await getCSVData(['A', 'B', 'C'])
    expect(parsedCSV.length).toBeGreaterThan(0)
    expect(parsedCSV[0]).toEqual({ A: '50', B: '60', C: '110' })
  })
})
