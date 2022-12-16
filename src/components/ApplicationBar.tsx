import PlusOneIcon from '@mui/icons-material/PlusOne'
import { AppBar, Box, Button, Toolbar, styled } from '@mui/material'
import { useCallback } from 'react'

import { useAppDispatch } from '../redux/hooks/hooks'
import { addColumn, addRow } from '../redux/spreadsheet/spreadsheetSlice'

const ActionButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  marginRight: theme.spacing(1),
}))

const ApplicationBar = () => {
  const dispatch = useAppDispatch()

  const onAddRowClick = useCallback(() => {
    dispatch(addRow())
  }, [dispatch])

  const onAddColumnClick = useCallback(() => {
    dispatch(addColumn())
  }, [dispatch])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <ActionButton
            startIcon={<PlusOneIcon />}
            onClick={onAddRowClick}
            variant="contained"
            color="info"
          >
            Row
          </ActionButton>
          <ActionButton
            startIcon={<PlusOneIcon />}
            onClick={onAddColumnClick}
            variant="contained"
            color="info"
          >
            Column
          </ActionButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default ApplicationBar
