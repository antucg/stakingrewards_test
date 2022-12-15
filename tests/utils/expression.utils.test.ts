import { curateExpression } from '../../src/utils/expressions/utils'

describe('Expression utils test', () => {
  it('should remove white spaces', () => {
    expect(curateExpression(' 5 ')).toBe('5')
  })

  it('should remove equal sign', () => {
    expect(curateExpression(' =5 ')).toBe('5')
  })

  it('should remove leading zeros from referenced cell', () => {
    expect(curateExpression('=A01')).toBe('A1')
  })

  it('should remove leading zeros from multiple referenced cells', () => {
    expect(curateExpression('=A0001 + B0002 + C0003')).toBe('A1 + B2 + C3')
  })

  it('should convert lowercase to uppercase', () => {
    expect(curateExpression('=a01 + b2')).toBe('A1 + B2')
  })
})
