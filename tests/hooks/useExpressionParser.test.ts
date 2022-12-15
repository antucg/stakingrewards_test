import useExpressionParser from '../../src/hooks/useExpressionParser'
import { RootState } from '../../src/redux/store'
import { resetGraph } from '../../src/utils/dependencyGraph'
import { ERROR_VALUE } from '../../src/utils/expressions/utils'
import { renderHook } from '../testing-utils'

describe('useExpressionParser test', () => {
  let state: RootState

  beforeEach(() => {
    resetGraph()
    state = {
      spreadsheet: {
        filterQuery: '',
        data: {
          rows: [],
          version: 1,
        },
        status: 'initialising',
        errorMessage: null,
        progressData: {
          id: null,
          done_at: null,
        },
      },
    }
  })

  it('should return an empty string when expression is empty', () => {
    const { result } = renderHook(() => useExpressionParser('', 0, 'A'))
    expect(result.current).toBe('')
  })

  it('should return value when it is not an expression', () => {
    const { result } = renderHook(() => useExpressionParser('5', 0, 'A'))
    expect(result.current).toBe('5')
  })

  it('should process an expression with no references to other cells', () => {
    const { result } = renderHook(() => useExpressionParser('=5 + 2', 0, 'A'))
    expect(result.current).toBe('7')
  })

  it('should return error when expression is incorrect', () => {
    const { result } = renderHook(() => useExpressionParser('=5 + A', 0, 'A'))
    expect(result.current).toBe(ERROR_VALUE)
  })

  it('should return value from referenced cell', () => {
    state.spreadsheet.data.rows = [
      {
        idx: 0,
        key: 'random-key',
        columns: {
          A: { data: '1', value: '1' },
          B: { data: '2', value: '2' },
          C: { data: '3', value: '3' },
        },
      },
    ]
    const { result } = renderHook(() => useExpressionParser('=B0', 0, 'A'), {
      preloadedState: state,
    })
    expect(result.current).toBe('2')
  })

  it('should calculate expression with one number and one referenced cell', () => {
    state.spreadsheet.data.rows = [
      {
        idx: 0,
        key: 'random-key',
        columns: {
          A: { data: '1', value: '1' },
          B: { data: '2', value: '2' },
          C: { data: '3', value: '3' },
        },
      },
    ]
    const { result } = renderHook(() => useExpressionParser('=B0 + 2', 0, 'A'), {
      preloadedState: state,
    })
    expect(result.current).toBe('4')
  })

  it('should calculate expression with referenced cells', () => {
    state.spreadsheet.data.rows = [
      {
        idx: 0,
        key: 'random-key',
        columns: {
          A: { data: '100', value: '100' },
          B: { data: '200', value: '200' },
          C: { data: '5', value: '5' },
        },
      },
    ]
    const { result } = renderHook(() => useExpressionParser('=A0 + B0', 0, 'C'), {
      preloadedState: state,
    })
    expect(result.current).toBe('300')
  })

  it('should return an error if one referenced cell has errors', () => {
    state.spreadsheet.data.rows = [
      {
        idx: 0,
        key: 'random-key',
        columns: {
          A: { data: '100', value: '100' },
          B: { data: '200', value: '200' },
          C: { data: '=A10', value: ERROR_VALUE },
        },
      },
    ]
    const { result } = renderHook(() => useExpressionParser('=B0 + C0', 0, 'A'), {
      preloadedState: state,
    })
    expect(result.current).toBe(ERROR_VALUE)
  })

  it.only('should process expression with leading zeros in referenced cell', () => {
    state.spreadsheet.data.rows = [
      {
        idx: 0,
        key: 'random-key',
        columns: {
          A: { data: '100', value: '100' },
          B: { data: '200', value: '200' },
          C: { data: '300', value: '300' },
        },
      },
    ]
    const { result } = renderHook(() => useExpressionParser('=B00', 0, 'A'), {
      preloadedState: state,
    })
    expect(result.current).toBe('200')
  })
})
