export const ERROR_VALUE = '!ERROR'

export const curateExpression = (expression: string) =>
  expression
    .trim()
    .replace('=', '')
    .toUpperCase()
    .replace(/([A-Z]+)0*(\d)/g, '$1$2')
