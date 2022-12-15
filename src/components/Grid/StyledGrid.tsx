import { styled } from '@mui/material'
import { Grid } from 'react-spreadsheet-grid'

const cellsColor = '#000'
const rowsBorderRadius = '5px'
const StyledGridWrapper = styled('div')(({ theme }) => ({
  '& .SpreadsheetGrid__header': {
    'fontWeight': 500,
    'borderRadius': rowsBorderRadius,
    'marginBottom': theme.spacing(1),
    'backgroundColor': '#efefef',

    '& .SpreadsheetGrid__headCell': {
      color: cellsColor,
      justifyContent: 'center',
      backgroundColor: 'transparent',
      border: '0 none',
    },
  },
  '& .SpreadsheetGrid': {
    'backgroundColor': 'transparent',

    '& .SpreadsheetGrid__row': {
      'backgroundColor': '#fafafa',
      'border': '0 none',
      'borderRadius': rowsBorderRadius,
      'marginBottom': theme.spacing(0.5),

      '& .SpreadsheetGrid__cell': {
        'borderColor': 'rgba(150, 150, 150, .3)',
        '&:first-of-type': {
          borderLeft: '0 none',
        },
        '&:last-child': {
          borderRight: '0 none',
        },
      },
    },
  },
}))

const StyledGrid = (props: any) => (
  <StyledGridWrapper>
    <Grid {...props} />
  </StyledGridWrapper>
)

export default StyledGrid
