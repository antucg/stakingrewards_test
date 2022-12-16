export const ERROR_VALUE = '!ERROR'
export const ERROR_CIRCULAR = '!REF'

export const isError = (value: string) => value === ERROR_VALUE || value === ERROR_CIRCULAR

export const curateExpression = (expression: string) =>
  expression
    .trim()
    .replace('=', '')
    .toUpperCase()
    .replace(/([A-Z]+)0*(\d)/g, '$1$2')
