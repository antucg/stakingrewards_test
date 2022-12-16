import { styled, colors } from '@mui/material'
import { Grid } from 'react-spreadsheet-grid'

const cellsColor = '#000'
export const rowsBorderRadius = '5px'
const StyledGridWrapper = styled('div')(({ theme }) => ({
  '& .SpreadsheetGrid__header': {
    'fontWeight': 500,
    'borderRadius': rowsBorderRadius,
    'marginBottom': theme.spacing(1),
    'overflow': 'hidden',

    '& .SpreadsheetGrid__headCell': {
      color: cellsColor,
      justifyContent: 'center',
      backgroundColor: '#efefef',
      border: '0 none',
    },
  },
  '& .SpreadsheetGridScrollWrapper': {
    'border': '0 none',
    'height': 'calc(100vh - 260px) !important',

    '& .SpreadsheetGrid': {
      'backgroundColor': 'transparent',

      '& .SpreadsheetGrid__row': {
        'border': '0 none',
        'borderRadius': rowsBorderRadius,
        'marginBottom': theme.spacing(0.5),

        '& .SpreadsheetGrid__cell': {
          'padding': 0,
          'backgroundColor': '#fafafa',
          'borderColor': 'rgba(150, 150, 150, .3)',

          '&:first-of-type': {
            borderLeft: '0 none',
          },
          '&:last-child': {
            borderRight: '0 none',
          },

          '& > div': {
            border: '1px solid transparent',
            borderRadius: rowsBorderRadius,
          },

          '&.SpreadsheetGrid__cell_active': {
            'boxShadow': 'none',

            '& > div': {
              borderColor: colors.blue[700],
            },
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
