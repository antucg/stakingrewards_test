import { SpreadsheetRow } from '../../../@types/common'
import { updateSpreadsheet } from '../../../src/redux/spreadsheet/spreadsheetUpdater'
import { resetGraph } from '../../../src/utils/dependencyGraph'
import { ERROR_CIRCULAR, ERROR_VALUE } from '../../../src/utils/expressions/utils'

describe('Spreadsheet updater test', () => {
  let spreadsheet: Array<SpreadsheetRow> = []

  beforeEach(() => {
    resetGraph()
    spreadsheet = [
      {
        idx: 0,
        key: '79f3153e-7987-4a7a-9b7c-7d9a64cd1e05',
        columns: {
          A: {
            data: '50',
            value: '50',
          },
          B: {
            data: '60',
            value: '60',
          },
          C: {
            data: '110',
            value: '110',
          },
        },
      },
      {
        idx: 1,
        key: 'b5fedace-0362-4ba8-bc35-9f0feede6650',
        columns: {
          A: {
            data: '50',
            value: '50',
          },
          B: {
            data: '60',
            value: '60',
          },
          C: {
            data: '110',
            value: '110',
          },
        },
      },
      {
        idx: 2,
        key: '4588a722-9941-4dcd-b925-76022af38327',
        columns: {
          A: {
            data: '50',
            value: '50',
          },
          B: {
            data: '60',
            value: '60',
          },
          C: {
            data: '110',
            value: '110',
          },
        },
      },
    ]
  })

  it('should return value when no expression', () => {
    const updatedCell = updateSpreadsheet('foo', 0, 'A', spreadsheet)
    expect(updatedCell).toHaveLength(1)
    expect(updatedCell[0]?.row).toBe(0)
    expect(updatedCell[0]?.column).toBe('A')
    expect(updatedCell[0]?.value).toBe('foo')
  })

  it('should calculate mathematical expression', () => {
    const updatedCell = updateSpreadsheet('=5 + 2', 0, 'A', spreadsheet)
    expect(updatedCell).toHaveLength(1)
    expect(updatedCell[0]?.row).toBe(0)
    expect(updatedCell[0]?.column).toBe('A')
    expect(updatedCell[0]?.value).toBe('7')
  })

  it('should copy value from another cell', () => {
    const expression = '=C0'
    spreadsheet[0]!.columns.A!.data = expression
    const updatedCell = updateSpreadsheet(expression, 0, 'A', spreadsheet)
    expect(updatedCell).toHaveLength(1)
    expect(updatedCell[0]?.row).toBe(0)
    expect(updatedCell[0]?.column).toBe('A')
    expect(updatedCell[0]?.value).toBe('110')
  })

  it('should process mathematical expression with number and referenced cell', () => {
    const expression = '=C0 + 2'
    spreadsheet[0]!.columns.A!.data = expression
    const updatedCell = updateSpreadsheet(expression, 0, 'A', spreadsheet)
    expect(updatedCell).toHaveLength(1)
    expect(updatedCell[0]?.row).toBe(0)
    expect(updatedCell[0]?.column).toBe('A')
    expect(updatedCell[0]?.value).toBe('112')
  })

  it('should process mathematical expression between two referenced cell', () => {
    const expression = '=B0 + C1'
    spreadsheet[0]!.columns.A!.data = expression
    const updatedCell = updateSpreadsheet(expression, 0, 'A', spreadsheet)
    expect(updatedCell).toHaveLength(1)
    expect(updatedCell[0]?.row).toBe(0)
    expect(updatedCell[0]?.column).toBe('A')
    expect(updatedCell[0]?.value).toBe('170')
  })

  it('should return an error when expression is incorrect', () => {
    const expression = '=foo + 2'
    spreadsheet[0]!.columns.A!.data = expression
    const updatedCell = updateSpreadsheet(expression, 0, 'A', spreadsheet)
    expect(updatedCell).toHaveLength(1)
    expect(updatedCell[0]?.row).toBe(0)
    expect(updatedCell[0]?.column).toBe('A')
    expect(updatedCell[0]?.value).toBe(ERROR_VALUE)
  })

  it('should return a dependecy cycle error when cycle exists', () => {
    const expressionB = '=A0'
    spreadsheet[0]!.columns.B!.data = expressionB
    updateSpreadsheet(expressionB, 0, 'B', spreadsheet)
    const expressionA = '=B0'
    spreadsheet[0]!.columns.A!.data = expressionA
    const updatedCell = updateSpreadsheet(expressionA, 0, 'A', spreadsheet)
    expect(updatedCell).toHaveLength(2)
    expect(updatedCell[0]?.row).toBe(0)
    expect(updatedCell[0]?.column).toBe('A')
    expect(updatedCell[0]?.value).toBe(ERROR_CIRCULAR)
    expect(updatedCell[1]?.row).toBe(0)
    expect(updatedCell[1]?.column).toBe('B')
    expect(updatedCell[1]?.value).toBe(ERROR_CIRCULAR)
  })

  it('should return a dependecy cycle error when pointing to a cell in a cycle', () => {
    /**
     * A -> B -> A, then we point C -> B
     */
    const expressionB = '=A0'
    spreadsheet[0]!.columns.B!.data = expressionB
    updateSpreadsheet(expressionB, 0, 'B', spreadsheet)
    spreadsheet[0]!.columns.B!.value = ERROR_CIRCULAR
    const expressionA = '=B0'
    spreadsheet[0]!.columns.A!.data = expressionA
    updateSpreadsheet(expressionA, 0, 'A', spreadsheet)
    spreadsheet[0]!.columns.A!.value = ERROR_CIRCULAR

    const expressionC = '=B0'
    spreadsheet[0]!.columns.C!.data = expressionC
    const updatedCell = updateSpreadsheet(expressionC, 0, 'C', spreadsheet)

    expect(updatedCell).toHaveLength(1)
    expect(updatedCell[0]?.row).toBe(0)
    expect(updatedCell[0]?.column).toBe('C')
    expect(updatedCell[0]?.value).toBe(ERROR_CIRCULAR)
  })

  it('should update all celss in a cycle when this no longer exist', () => {
    // A -> B
    const expressionA = '=B0'
    spreadsheet[0]!.columns.A!.data = expressionA
    updateSpreadsheet(expressionA, 0, 'A', spreadsheet)
    spreadsheet[0]!.columns.A!.value = ERROR_CIRCULAR

    // B -> C
    const expressionB = '=C0'
    spreadsheet[0]!.columns.B!.data = expressionB
    updateSpreadsheet(expressionB, 0, 'B', spreadsheet)
    spreadsheet[0]!.columns.B!.value = ERROR_CIRCULAR

    // C -> A
    const expressionC = '=A0'
    spreadsheet[0]!.columns.C!.data = expressionC
    updateSpreadsheet(expressionC, 0, 'C', spreadsheet)
    spreadsheet[0]!.columns.C!.value = ERROR_CIRCULAR

    const fixExpression = '2'
    spreadsheet[0]!.columns.B!.data = fixExpression
    const updatedCells = updateSpreadsheet(fixExpression, 0, 'B', spreadsheet)

    expect(updatedCells).toHaveLength(3)
    expect(updatedCells[0]?.row).toBe(0)
    expect(updatedCells[1]?.row).toBe(0)
    expect(updatedCells[2]?.row).toBe(0)
    expect(
      [updatedCells[0]?.column, updatedCells[1]?.column, updatedCells[2]?.column].sort(),
    ).toEqual(['A', 'B', 'C'])
    expect(updatedCells[0]?.value).toBe(fixExpression)
    expect(updatedCells[1]?.value).toBe(fixExpression)
    expect(updatedCells[2]?.value).toBe(fixExpression)
  })
})
