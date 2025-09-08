export function validateEnrollment(e) {
  const errors = {}
  if (!e.playerName?.trim()) errors.playerName = 'Player required'
  if (!e.age || e.age < 3 || e.age > 16) errors.age = 'Age 3-16'
  if (!e.guardianName?.trim()) errors.guardianName = 'Guardian required'
  if (!/^[0-9\-\s()+]{7,}$/.test(e.contactPhone || '')) errors.contactPhone = 'Phone invalid'
  return { ok: Object.keys(errors).length === 0, errors }
}
