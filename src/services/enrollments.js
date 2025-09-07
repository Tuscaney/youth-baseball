const base = import.meta.env.VITE_API_BASE || ''

export async function listEnrollments() {
  const r = await fetch(`${base}/api/enrollments`)
  return r.json()
}
export async function createEnrollment(payload) {
  const r = await fetch(`${base}/api/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return r.json()
}

export async function updateEnrollment(id, patch) {
  const r = await fetch(`${base}/api/enrollments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  })
  return r.json()
}
export async function deleteEnrollment(id) {
  await fetch(`${base}/api/enrollments/${id}`, { method: 'DELETE' })
}
