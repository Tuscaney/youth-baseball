import { validateEnrollment } from './validation'

it('accepts valid enrollment', () => {
  const { ok } = validateEnrollment({ playerName:'A', age:10, guardianName:'G', contactPhone:'555-555-5555' })
  expect(ok).toBe(true)
})
it('rejects invalid age and phone', () => {
  const { ok, errors } = validateEnrollment({ playerName:'A', age:2, guardianName:'G', contactPhone:'x' })
  expect(ok).toBe(false)
  expect(errors.age).toBeTruthy()
  expect(errors.contactPhone).toBeTruthy()
})
