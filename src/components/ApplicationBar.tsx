import AddIcon from '@mui/icons-material/Add'
import { AppBar, Box, Toolbar, Tooltip, IconButton } from '@mui/material'
import { useCallback } from 'react'

import { useAppDispatch } from '../redux/hooks/hooks'
import { addRow } from '../redux/spreadsheet/spreadsheetSlice'

const ApplicationBar = () => {
  const dispatch = useAppDispatch()

  const onAddRowClick = useCallback(() => {
    dispatch(addRow())
  }, [dispatch])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Tooltip title="Add new row">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={onAddRowClick}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default ApplicationBar
