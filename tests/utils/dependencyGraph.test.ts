import { getCellReferencesFromExpression } from '../../src/utils/dependencyGraph'

describe('dependencyGraph test', () => {
  it('should parse expression without cell references', () => {
    const result = getCellReferencesFromExpression('=1 + 2', 0, 'A')
    expect(result).toEqual([])
  })

  it('should parse expression with one cell reference', () => {
    const result = getCellReferencesFromExpression('=1 + A2', 0, 'A')
    expect(result).toEqual([{ column: 'A', row: 2 }])
  })

  it('should parse expression with multiple cell references', () => {
    const result = getCellReferencesFromExpression('=1 + A2 + C3', 0, 'A')
    expect(result).toEqual([
      { column: 'A', row: 2 },
      { column: 'C', row: 3 },
    ])
  })

  it('should return parent references as well', () => {
    getCellReferencesFromExpression('=1 + A2', 0, 'A')

    const result = getCellReferencesFromExpression('=1 + C3', 2, 'A')
    expect(result).toEqual([
      { column: 'A', row: 0 },
      { column: 'C', row: 3 },
    ])
  })

  it('should return an empty list when a node is no longer referenced', () => {
    getCellReferencesFromExpression('=1 + A2', 0, 'A')
    const result = getCellReferencesFromExpression('=1 + 2', 0, 'A')
    expect(result).toEqual([])
  })

  it('should remove leading zeros from formula', () => {
    const result = getCellReferencesFromExpression('=A01', 0, 'A')
    expect(result).toEqual([
      {
        column: 'A',
        row: 1,
      },
    ])
  })
})
