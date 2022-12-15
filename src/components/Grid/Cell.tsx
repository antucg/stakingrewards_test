import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Input, InputAdornment } from '@mui/material'
import { ChangeEvent, useCallback, useState } from 'react'

import { SpreadsheetCell } from '../../../@types/common'
import useExpressionParser from '../../hooks/useExpressionParser'
import { useAppDispatch } from '../../redux/hooks/hooks'
import { updateCell } from '../../redux/spreadsheet/spreadsheetSlice'

interface CellProps {
  data: SpreadsheetCell
  row: number
  column: string
  focus: boolean
}

const Cell = ({ data, row, column }: CellProps) => {
  const dispatch = useAppDispatch()
  const [previousCellData, setPreviousCellData] = useState<string>('null')
  const [cellData, setCellData] = useState(data.data)
  const [isFocused, setIsFocused] = useState(false)
  const cellValue = useExpressionParser(cellData, row, column)

  const updateStore = useCallback(
    (cellData: SpreadsheetCell) => dispatch(updateCell({ row, column, data: cellData })),
    [row, column, dispatch],
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCellData(e.target.value)
  }, [])

  const onFocus = useCallback(() => {
    setIsFocused(true)
    setPreviousCellData(cellData)
  }, [cellData])

  const onBlur = useCallback(() => {
    setIsFocused(false)
    if (previousCellData !== cellData) {
      updateStore({ data: cellData, value: cellValue })
    }
  }, [cellValue, cellData, previousCellData, updateStore])

  return (
    <Input
      value={isFocused === true ? cellData : cellValue}
      fullWidth
      disableUnderline
      inputProps={{
        style: {
          textAlign: 'center',
          fontSize: '11px',
        },
      }}
      endAdornment={
        <InputAdornment position="end">
          <EditOutlinedIcon sx={{ fontSize: 12 }} />
        </InputAdornment>
      }
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}

export default Cell
