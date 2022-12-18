import Cell from '../../src/components/Grid/Cell'
import { render, screen, fireEvent } from '../testing-utils'

describe('Cell component test', () => {
  it("shouldn't modify expression if this doesn't start with equal char", () => {
    render(<Cell row={0} column={'A'} data={{ data: '', value: '' }} focus={false} />)
    const input: HTMLInputElement = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.focus(input)
    expect(input.value).toBe('foo')
  })

  it('should curate expression if this starts with equal char', () => {
    render(<Cell row={0} column={'A'} data={{ data: '', value: '' }} focus={false} />)
    const input: HTMLInputElement = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '=a00 + b01 ' } })
    fireEvent.focus(input)
    expect(input.value).toBe('=A0 + B1')
  })
})
