import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// Basic smoke test + presence of core sections
it('renders headings', () => {
  render(<App />)
  expect(screen.getByText(/Youth Baseball Enrollment/i)).toBeInTheDocument()
  expect(screen.getByText(/New Enrollment/i)).toBeInTheDocument()
  expect(screen.getByText(/Enrollments/i)).toBeInTheDocument()
})
