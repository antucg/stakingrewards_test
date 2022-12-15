import { Container, styled } from '@mui/material'
import { useEffect } from 'react'

import ApplicationBar from './components/ApplicationBar'
import Grid from './components/Grid'
import Search from './components/Search'
import SyncIndicator from './components/Sync'
import { useAppDispatch } from './redux/hooks/hooks'
import { getSpreadsheet } from './redux/spreadsheet/spreadsheetSlice'

const Title = styled('h1')(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}))

const SyncIndicatorWrapper = styled('div')({
  position: 'fixed',
  bottom: '40px',
  right: '40px',
})

const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getSpreadsheet())
  }, [dispatch])

  return (
    <>
      <ApplicationBar />
      <Container>
        <Title>UI Spreadsheet</Title>
        <Search />
        <Grid />
        <SyncIndicatorWrapper>
          <SyncIndicator />
        </SyncIndicatorWrapper>
      </Container>
    </>
  )
}

export default App
