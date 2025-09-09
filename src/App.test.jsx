import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

it('renders headings', async () => {
  render(<App />);

  // Be specific: use the heading role (h1/h2) so we don't match body text.
  expect(
    await screen.findByRole('heading', { name: /Youth Baseball Enrollment/i, level: 1 })
  ).toBeInTheDocument();

  expect(
    await screen.findByRole('heading', { name: /New Enrollment/i, level: 2 })
  ).toBeInTheDocument();

  expect(
    await screen.findByRole('heading', { name: /Enrollments/i, level: 2 })
  ).toBeInTheDocument();

  // If a Loading… placeholder appears first, wait for it to clear.
  await waitFor(() => {
    expect(screen.queryByText(/Loading…/i)).not.toBeInTheDocument();
  });
});


