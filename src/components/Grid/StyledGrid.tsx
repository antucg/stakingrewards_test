import { styled } from '@mui/material'
import { Grid } from 'react-spreadsheet-grid'

const cellsColor = '#000'
const rowsBorderRadius = '5px'
const StyledGridWrapper = styled('div')(({ theme }) => ({
  'marginBottom': theme.spacing(4),

  '& .SpreadsheetGrid__header': {
    'fontWeight': 500,
    'borderRadius': rowsBorderRadius,
    'paddingBottom': theme.spacing(1),

    '& .SpreadsheetGrid__headCell': {
      color: cellsColor,
      justifyContent: 'center',
      backgroundColor: '#efefef',
      border: '0 none',
    },
  },
  '& .SpreadsheetGridScrollWrapper': {
    'border': '0 none',
    'height': 'calc(100vh - 212px) !important',

    '& .SpreadsheetGrid': {
      'backgroundColor': 'transparent',

      '& .SpreadsheetGrid__row': {
        'border': '0 none',
        'borderRadius': rowsBorderRadius,
        'paddingBottom': theme.spacing(0.5),

        '& .SpreadsheetGrid__cell': {
          'backgroundColor': '#fafafa',
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
  },
}))

const StyledGrid = (props: any) => (
  <StyledGridWrapper>
    <Grid {...props} />
  </StyledGridWrapper>
)

export default StyledGrid
