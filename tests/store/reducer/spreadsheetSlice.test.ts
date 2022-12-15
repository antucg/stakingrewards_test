import spreadsheetReducer, {
  addRow,
  getSpreadsheet,
} from '../../../src/redux/spreadsheet/spreadsheetSlice'
import { RootState } from '../../../src/redux/store'

describe('Spreadsheet slice test', () => {
  let state: RootState

  beforeEach(() => {
    state = {
      spreadsheet: {
        filterQuery: '',
        data: {
          headers: ['A', 'B', 'C'],
          rows: [],
          version: 1,
        },
        status: 'initialising',
        errorMessage: null,
        progressData: {
          id: null,
          done_at: null,
        },
      },
    }
  })

  it('should add an empty row with default headers when CSV data is not available', () => {
    const action = {
      type: getSpreadsheet.fulfilled,
      payload: { headers: [], rows: [], version: 1 },
    }
    const newState = spreadsheetReducer(state.spreadsheet, action)
    expect(newState.data.rows.length).toBe(1)
    expect(newState.data.rows[0]?.idx).toBe(0)
    expect(newState.data.rows[0]?.key).toBeTruthy()
    expect(newState.data.rows[0]?.columns).toMatchObject({
      A: {
        data: '',
        value: '',
      },
      B: {
        data: '',
        value: '',
      },
      C: {
        data: '',
        value: '',
      },
    })
  })

  it('should add a new row', () => {
    const action = {
      type: addRow.type,
    }
    const newState = spreadsheetReducer(state.spreadsheet, action)
    expect(newState.data.rows.length).toBe(1)
    expect(newState.data.rows[0]?.idx).toBe(0)
    expect(newState.data.rows[0]?.key).toBeTruthy()
    expect(newState.data.rows[0]?.columns).toMatchObject({
      A: {
        data: '',
        value: '',
      },
      B: {
        data: '',
        value: '',
      },
      C: {
        data: '',
        value: '',
      },
    })
  })
})
