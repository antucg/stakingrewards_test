import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Input, InputAdornment, styled } from '@mui/material'
import { ChangeEvent, KeyboardEvent, useCallback, useRef, useState } from 'react'

import { SpreadsheetCell } from '../../../@types/common'
import useExpressionParser from '../../hooks/useExpressionParser'
import { useAppDispatch } from '../../redux/hooks/hooks'
import { updateCell } from '../../redux/spreadsheet/spreadsheetSlice'
import { ERROR_VALUE } from '../../utils/expressions/utils'
import { rowsBorderRadius } from './StyledGrid'

const InputWrapper = styled('div')({
  'padding': '8px 10px',
  'width': '100%',
  'height': '100%',

  '&.error': {
    backgroundColor: '#ffefef',
    border: '1px solid #AF3434',
    borderRadius: rowsBorderRadius,
  },
})

interface CellProps {
  data: SpreadsheetCell
  row: number
  column: string
  focus: boolean
}

const Cell = ({ data, row, column }: CellProps) => {
  const inputRef = useRef<HTMLInputElement>()
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

  /**
   * Force input blur when pressing the Enter key
   */
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
    }
  }, [])

  return (
    <InputWrapper className={`${cellValue === ERROR_VALUE ? 'error' : ''}`}>
      <Input
        inputRef={inputRef}
        type="text"
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
        onKeyDown={onKeyDown}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </InputWrapper>
  )
}

export default Cell
