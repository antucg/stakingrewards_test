import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Input, InputAdornment, styled } from '@mui/material'
import { ChangeEvent, KeyboardEvent, useCallback, useRef, useState } from 'react'

import { CellData, SpreadsheetCell } from '../../../@types/common'
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks'
import { getCellValue } from '../../redux/spreadsheet/spreadsheetSelector'
import { updateCell } from '../../redux/spreadsheet/spreadsheetSlice'
import { isError, curateExpression } from '../../utils/expressions/utils'
import { rowsBorderRadius } from './StyledGrid'

const InputWrapper = styled('div')({
  'padding': '8px 10px',
  'width': '100%',
  'height': '100%',

  '&.error': {
    backgroundColor: '#ffefef',
    borderColor: '#AF3434 !important',
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
  const [cellData, setCellData] = useState(data.data)
  const [isFocused, setIsFocused] = useState(false)
  const cellValue = useAppSelector(getCellValue({ row, column }))

  const updateStore = useCallback(
    (cellData: CellData) => dispatch(updateCell({ row, column, data: cellData })),
    [row, column, dispatch],
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCellData(e.target.value.startsWith('=') ? curateExpression(e.target.value) : e.target.value)
  }, [])

  const onFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const onBlur = useCallback(() => {
    setIsFocused(false)
    updateStore(cellData)
  }, [cellData, updateStore])

  /**
   * Force input blur when pressing the Enter key
   */
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      inputRef.current?.blur()
    }
  }, [])

  return (
    <InputWrapper className={`${isError(cellValue) ? 'error' : ''}`}>
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
