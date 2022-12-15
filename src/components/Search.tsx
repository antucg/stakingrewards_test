import ClearIcon from '@mui/icons-material/HighlightOff'
import SearchIcon from '@mui/icons-material/Search'
import { Box, FilledInput, InputAdornment, styled } from '@mui/material'
import { debounce } from 'lodash'
import { ChangeEvent, useEffect, useState, useMemo } from 'react'

import { useAppDispatch } from '../redux/hooks/hooks'
import { updateQuery } from '../redux/spreadsheet/spreadsheetSlice'

const ClearIconButton = styled(ClearIcon)({
  cursor: 'pointer',
})

const SearchInput = styled(FilledInput)({
  borderRadius: '5px',
})

const SpreadsheetSearch = () => {
  const dispatch = useAppDispatch()
  const [query, setQuery] = useState('')

  const updateStore = (query: string) => dispatch(updateQuery(query))
  /**
   * Debounce store update so we don't perform too many requests while the user is still typing
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateStore = useMemo(() => debounce(updateStore, 300), [])

  // Clean up debounce call in case the component gets unmounted before execution
  useEffect(() => () => debouncedUpdateStore.cancel(), [debouncedUpdateStore])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    debouncedUpdateStore(e.target.value)
  }

  const onClear = () => {
    setQuery('')
    debouncedUpdateStore('')
  }

  return (
    <Box>
      <SearchInput
        placeholder="Type a search query to filter"
        fullWidth
        hiddenLabel
        aria-label="Type a search query to filter"
        disableUnderline
        size="small"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        endAdornment={
          query !== '' && (
            <InputAdornment position="end">
              <ClearIconButton onClick={onClear} />
            </InputAdornment>
          )
        }
        value={query}
        onChange={onChange}
        inputProps={{
          style: {
            fontSize: '12px',
          },
        }}
      />
    </Box>
  )
}

export default SpreadsheetSearch
