import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

it('allows typing into form', async () => {
  render(<App />)
  const player = screen.getByPlaceholderText(/Player name/i)
  await userEvent.type(player, 'Sam')
  expect(player).toHaveValue('Sam')
})
