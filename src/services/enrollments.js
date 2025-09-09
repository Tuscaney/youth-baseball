// Test-friendly services: real network in dev/prod, in-memory store in Vitest.
const base = import.meta.env.VITE_API_BASE || '';
const isTest = typeof process !== 'undefined' && process.env.VITEST;

// Tiny in-memory DB for tests (no network)
let TEST_DB = [];

async function jsonOrThrow(r) {
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`HTTP ${r.status} ${r.statusText} - ${text.slice(0, 200)}`);
  }
  return r.json();
}

export async function listEnrollments() {
  if (isTest) return [...TEST_DB];
  const r = await fetch(`${base}/api/enrollments`);
  return jsonOrThrow(r);
}

export async function createEnrollment(payload) {
  if (isTest) {
    const item = { id: `t_${Math.random().toString(36).slice(2, 9)}`, ...payload };
    TEST_DB = [item, ...TEST_DB];
    return item;
  }
  const r = await fetch(`${base}/api/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return jsonOrThrow(r);
}

export async function updateEnrollment(id, patch) {
  if (isTest) {
    const i = TEST_DB.findIndex(it => it.id === id);
    if (i >= 0) {
      TEST_DB[i] = { ...TEST_DB[i], ...patch };
      return { ...TEST_DB[i] };
    }
    return { id, ...patch };
  }
  const r = await fetch(`${base}/api/enrollments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  return jsonOrThrow(r);
}

export async function deleteEnrollment(id) {
  if (isTest) {
    TEST_DB = TEST_DB.filter(it => it.id !== id);
    return;
  }
  const r = await fetch(`${base}/api/enrollments/${id}`, { method: 'DELETE' });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`HTTP ${r.status} ${r.statusText} - ${text.slice(0, 200)}`);
  }
}


