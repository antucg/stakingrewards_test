import { createAsyncThunk } from '@reduxjs/toolkit'

import { Spreadsheet } from '../../../@types/common'
import { getCSVData, getStatus, saveCSV } from '../../api'
import isValidJson from '../../utils/parsers/jsonCsvValidator'
import jsonToCsv from '../../utils/parsers/jsonToCsv'
import jsonToSpreadsheet from '../../utils/parsers/jsonToSpreadsheet'

export const getSpreadsheet = createAsyncThunk(
  'spreadsheet/get',
  async (headers: Array<string> = ['A', 'B', 'C']) => {
    // Read data
    const data = await getCSVData(headers)

    // Validate that the format of the data is correct
    if (!isValidJson(data, headers)) {
      throw new Error('Invalid CSV data')
    }

    // Change json to match the structure that will be used to render the data in the grid
    return jsonToSpreadsheet(data)
  },
)

export const saveSpreadsheet = createAsyncThunk('spreadsheet/save', (data: Spreadsheet) => {
  const csvString = jsonToCsv(data)
  return saveCSV(csvString)
})

export const getProgressStatus = createAsyncThunk('spreadsheet/getStatus', (id: string) =>
  getStatus(id),
)
