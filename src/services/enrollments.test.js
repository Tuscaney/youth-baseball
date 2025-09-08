import { listEnrollments, createEnrollment } from './enrollments'

beforeEach(() => {
  global.fetch = vi.fn()
})
afterEach(() => vi.restoreAllMocks())

it('listEnrollments calls /api/enrollments', async () => {
  fetch.mockResolvedValueOnce({ json: async () => [] })
  const data = await listEnrollments()
  expect(fetch).toHaveBeenCalledWith('/api/enrollments')
  expect(data).toEqual([])
})

it('createEnrollment posts body', async () => {
  fetch.mockResolvedValueOnce({ json: async () => ({ id: '1' }) })
  const created = await createEnrollment({ playerName: 'A' })
  expect(fetch).toHaveBeenCalled()
  const [, opts] = fetch.mock.calls[0]
  expect(opts.method).toBe('POST')
  expect(JSON.parse(opts.body)).toMatchObject({ playerName: 'A' })
  expect(created.id).toBe('1')
})
