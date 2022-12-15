import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Input, InputAdornment } from '@mui/material'
import { ChangeEvent, useState } from 'react'

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

  const updateStore = (cellData: SpreadsheetCell) =>
    dispatch(updateCell({ row, column, data: cellData }))

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCellData(e.target.value)
  }

  const onFocus = () => {
    setIsFocused(true)
    setPreviousCellData(cellData)
  }

  const onBlur = () => {
    setIsFocused(false)
    if (previousCellData !== cellData) {
      updateStore({ data: cellData, value: cellValue })
    }
  }

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
