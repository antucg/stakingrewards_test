import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

import { ProgressData, Spreadsheet, SpreadsheetCell } from '../../../@types/common'
import * as spreadhsheetThunks from './spreadsheetThunks'

interface UpdateCellData {
  row: number
  column: string
  data: SpreadsheetCell
}

export interface SpreadsheetState {
  filterQuery: string
  data: Spreadsheet
  status: 'initialising' | 'synced' | 'changed' | 'pending' | 'error'
  errorMessage: string | null
  progressData: ProgressData
}

const initialState: SpreadsheetState = {
  filterQuery: '',
  data: {
    rows: [],
    version: 1,
  },
  status: 'initialising',
  errorMessage: null,
  progressData: {
    id: null,
    done_at: null,
  },
}

export const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    updateQuery: (state, action: PayloadAction<string>) => {
      state.filterQuery = action.payload
    },
    updateCell: (state, action: PayloadAction<UpdateCellData>) => {
      state.data.rows[action.payload.row]!.columns[action.payload.column] = action.payload.data
      state.data.version += 1
      state.status = 'changed'
    },
    updateErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload
    },
    addRow: state => {
      state.data.rows.push({
        idx: state.data.rows.length + 1,
        key: uuidv4(),
        columns: {
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
        },
      })
    },
  },
  extraReducers: builder => {
    builder
      .addCase(spreadhsheetThunks.getSpreadsheet.fulfilled, (state, action) => {
        state.status = 'synced'
        state.data = action.payload
      })
      .addCase(spreadhsheetThunks.getSpreadsheet.rejected, state => {
        state.status = 'error'
        state.errorMessage = 'Error loading CSV data'
      })
      .addCase(spreadhsheetThunks.saveSpreadsheet.pending, state => {
        state.status = 'pending'
      })
      .addCase(spreadhsheetThunks.saveSpreadsheet.fulfilled, (state, action) => {
        if (action.payload.data.status === 'DONE') {
          state.status = 'synced'
        } else {
          state.progressData.id = action.payload.data.id
          state.progressData.done_at = action.payload.data.done_at
        }
      })
      .addCase(spreadhsheetThunks.saveSpreadsheet.rejected, state => {
        state.status = 'changed'
        state.errorMessage = 'Error persisting CSV'
      })
      .addCase(spreadhsheetThunks.getProgressStatus.fulfilled, (state, action) => {
        if (action.payload.data.status === 'DONE') {
          state.status = 'synced'
          state.progressData.id = null
          state.progressData.done_at = null
        }
      })
  },
})

export const { addRow, updateCell, updateErrorMessage, updateQuery } = spreadsheetSlice.actions
export * from './spreadsheetThunks'
export default spreadsheetSlice.reducer
