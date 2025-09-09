import { describe, it, expect, beforeEach, vi } from 'vitest';

// We re-import the module before each test so the in-memory DB resets.
let api;
beforeEach(async () => {
  vi.resetModules();
  api = await import('./enrollments.js'); // path is relative to this test file
});

describe('enrollments services (Vitest in-memory mode)', () => {
  it('listEnrollments starts empty', async () => {
    const list = await api.listEnrollments();
    expect(Array.isArray(list)).toBe(true);
    expect(list).toHaveLength(0);
  });

  it('create, update, delete flow works in-memory', async () => {
    const created = await api.createEnrollment({
      playerName: 'A',
      age: 9,
      guardianName: 'G',
      contactPhone: '555-0000',
      division: 'T-Ball',
      paid: false,
      notes: ''
    });

    expect(created.id).toBeTruthy();

    let all = await api.listEnrollments();
    expect(all).toHaveLength(1);
    expect(all[0].playerName).toBe('A');

    const updated = await api.updateEnrollment(created.id, { paid: true, division: 'Coach Pitch' });
    expect(updated.paid).toBe(true);
    expect(updated.division).toBe('Coach Pitch');

    await api.deleteEnrollment(created.id);
    all = await api.listEnrollments();
    expect(all).toHaveLength(0);
  });
});

