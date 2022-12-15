import DoneIcon from '@mui/icons-material/Done'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import SyncIcon from '@mui/icons-material/Sync'
import { keyframes, styled } from '@mui/material'
import { useEffect, useState } from 'react'

import useInterval from '../hooks/useInterval'
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks'
import {
  getErrorMessage,
  getProgressData,
  getStatus,
  getSpreadsheet,
} from '../redux/spreadsheet/spreadsheetSelector'
import {
  getProgressStatus,
  saveSpreadsheet,
  updateErrorMessage,
} from '../redux/spreadsheet/spreadsheetSlice'

const SyncBackground = styled('div')({
  backgroundColor: '#ccc',
  width: '50px',
  height: '50px',
  borderRadius: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const rotatingAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const RotatingSyncIcon = styled(SyncIcon)({
  animation: `${rotatingAnimation} 2s linear infinite`,
})

const shakeAnimation = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`
const ShakingErrorIcon = styled(ReportProblemIcon)({
  animation: `${shakeAnimation} 1s linear`,
})

const growShrinkAnimation = keyframes`
  50% {
    transform:scale(1.5);
  }
  100% {
    transform:scale(1);
  }
`
const DoneAnimatedIcon = styled(DoneIcon)({
  animation: `${growShrinkAnimation} 0.5s linear`,
})

const SyncIndicator = () => {
  const dispatch = useAppDispatch()
  const asyncStatus = useAppSelector(getStatus)
  const progressData = useAppSelector(getProgressData)
  const spreadsheet = useAppSelector(getSpreadsheet)
  const errorMessage = useAppSelector(getErrorMessage)
  const [showDone, setShowDone] = useState(false)

  useInterval(() => {
    if (progressData.id !== null && progressData.done_at !== null) {
      if (new Date() > new Date(progressData.done_at)) {
        dispatch(getProgressStatus(progressData.id))
      }
    } else if (asyncStatus === 'changed') {
      dispatch(saveSpreadsheet(spreadsheet))
    }
  }, 5000)

  useEffect(() => {
    const tId = setTimeout(() => dispatch(updateErrorMessage(null)), 2000)
    return () => clearTimeout(tId)
  }, [errorMessage, dispatch])

  useEffect(() => {
    if (asyncStatus === 'synced') {
      setShowDone(true)
      const tId = setTimeout(() => setShowDone(false), 2000)
      return () => clearTimeout(tId)
    }
  }, [asyncStatus])

  let output
  if (errorMessage !== null) {
    output = <ShakingErrorIcon />
  } else if (showDone === true) {
    output = <DoneAnimatedIcon />
  } else if (asyncStatus === 'pending' || asyncStatus === 'initialising') {
    output = <RotatingSyncIcon />
  } else {
    output = null
  }

  return output !== null ? <SyncBackground>{output}</SyncBackground> : null
}

export default SyncIndicator
