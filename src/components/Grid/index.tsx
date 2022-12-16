import { Box, Skeleton, styled } from '@mui/material'

import { SpreadsheetRow } from '../../../@types/common'
import { useAppSelector } from '../../redux/hooks/hooks'
import {
  getFilteredSpreadsheet,
  getSpreadsheetHeaders,
  getStatus,
} from '../../redux/spreadsheet/spreadsheetSelector'
import Cell from './Cell'
import StyledGrid from './StyledGrid'

const GridWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  height: '500px',
}))

const SkeletonTable = () => (
  <>
    <Skeleton sx={{ height: 32, marginBottom: 1 }} animation="wave" variant="rectangular" />
    <Skeleton sx={{ height: 32, marginBottom: 0.5 }} animation="wave" variant="rectangular" />
    <Skeleton sx={{ height: 32, marginBottom: 0.5 }} animation="wave" variant="rectangular" />
    <Skeleton sx={{ height: 32, marginBottom: 0.5 }} animation="wave" variant="rectangular" />
    <Skeleton sx={{ height: 32 }} animation="wave" variant="rectangular" />
  </>
)

const initColumns = (headers: Array<string>) =>
  headers.map(h => ({
    title: () => h,
    value: (row: SpreadsheetRow, { focus }: { focus: boolean }) => (
      <Cell focus={focus} column={h} row={row.idx} data={row.columns[h]!} />
    ),
  }))

const SpreadsheetGrid = () => {
  const asyncStatus = useAppSelector(getStatus)
  const spreadsheet = useAppSelector(getFilteredSpreadsheet)
  const headers = useAppSelector(getSpreadsheetHeaders)

  return (
    <GridWrapper>
      {asyncStatus === 'initialising' && <SkeletonTable />}
      {spreadsheet.rows.length > 0 && (
        <StyledGrid
          isScrollable
          rows={spreadsheet.rows}
          columns={initColumns(headers)}
          getRowKey={(row: any) => row.key}
          headerHeight={40}
          rowHeight={36}
          isColumnResizable
        />
      )}
    </GridWrapper>
  )
}

export default SpreadsheetGrid
