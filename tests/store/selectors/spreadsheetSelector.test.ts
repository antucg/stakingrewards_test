import {
  getFilteredSpreadsheet,
  getSpreadsheetHeaders,
  getCellValues,
} from '../../../src/redux/spreadsheet/spreadsheetSelector'
import { RootState } from '../../../src/redux/store'

describe('Spreadsheet selector test', () => {
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

  it('should return filtered results', () => {
    state.spreadsheet.filterQuery = '2'
    state.spreadsheet.data.rows = [
      {
        idx: 0,
        key: 'de786e39-19a7-4bab-a31b-05387e09c17c',
        columns: {
          A: {
            data: '1',
            value: '1',
          },
          B: {
            data: '2',
            value: '2',
          },
          C: {
            data: '3',
            value: '3',
          },
        },
      },
      {
        idx: 1,
        key: '9e8c2196-b331-4516-802d-378d45af6ca8',
        columns: {
          A: {
            data: '4',
            value: '4',
          },
          B: {
            data: '5',
            value: '5',
          },
          C: {
            data: '6',
            value: '6',
          },
        },
      },
    ]

    const filteredRows = getFilteredSpreadsheet(state)
    expect(filteredRows.rows.length).toEqual(1)
    expect(filteredRows.rows[0]?.key).toEqual('de786e39-19a7-4bab-a31b-05387e09c17c')
    expect(filteredRows.rows[0]?.columns).toEqual(state.spreadsheet.data.rows[0]?.columns)
  })

  it('should return spreadsheet headers', () => {
    state.spreadsheet.data.rows = [
      {
        idx: 0,
        key: 'de786e39-19a7-4bab-a31b-05387e09c17c',
        columns: {
          A: {
            data: '1',
            value: '1',
          },
          B: {
            data: '2',
            value: '2',
          },
          C: {
            data: '3',
            value: '3',
          },
        },
      },
      {
        idx: 1,
        key: '9e8c2196-b331-4516-802d-378d45af6ca8',
        columns: {
          A: {
            data: '4',
            value: '4',
          },
          B: {
            data: '5',
            value: '5',
          },
          C: {
            data: '6',
            value: '6',
          },
        },
      },
    ]

    expect(getSpreadsheetHeaders(state)).toEqual(['A', 'B', 'C'])
  })

  it('should return cell values', () => {
    state.spreadsheet.data.rows = [
      {
        idx: 0,
        key: 'de786e39-19a7-4bab-a31b-05387e09c17c',
        columns: {
          A: {
            data: '=B1 - 1',
            value: '1',
          },
          B: {
            data: '2',
            value: '2',
          },
          C: {
            data: '3',
            value: '3',
          },
        },
      },
      {
        idx: 1,
        key: '9e8c2196-b331-4516-802d-378d45af6ca8',
        columns: {
          A: {
            data: '4',
            value: '4',
          },
          B: {
            data: '5',
            value: '5',
          },
          C: {
            data: '=B1 + 1',
            value: '6',
          },
        },
      },
    ]

    expect(
      getCellValues([
        { column: 'A', row: 0 },
        { column: 'C', row: 1 },
      ])(state),
    ).toEqual({ A0: '1', C1: '6' })
  })
})
