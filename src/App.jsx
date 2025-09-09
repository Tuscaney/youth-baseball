import { useEffect, useState } from 'react';
import { listEnrollments, createEnrollment, updateEnrollment, deleteEnrollment } from './services/enrollments';

function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div>
          <h1 className="hero__title">Youth Baseball Enrollment</h1>
          <p className="hero__tag">Sign up players, track payments, and manage divisions.</p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try { setItems(await listEnrollments()); } finally { setLoading(false); }
  })(); }, []);

  return (
    <div className="app">
      <div className="container">
        {/* Hero banner */}
        <Hero />

        {/* Small dashboard header under the hero */}
        <header className="header">
          <h2 className="title" style={{ margin: 0 }}>Dashboard</h2>
          <span className="badge">Local Dev</span>
        </header>

        <div className="grid">
          <section className="card" id="enroll-form">
            <h2>New Enrollment</h2>
            <EnrollmentForm onSubmit={async (payload) => {
              const created = await createEnrollment(payload);
              setItems(prev => [created, ...prev]);
            }} />
          </section>

          <section className="card">
            <h2>Enrollments</h2>
            {loading ? <p>Loading…</p> : (
              <EnrollmentList
                items={items}
                onUpdate={async (id, patch) => {
                  const updated = await updateEnrollment(id, patch);
                  setItems(prev => prev.map(it => it.id === id ? updated : it));
                }}
                onDelete={async (id) => {
                  await deleteEnrollment(id);
                  setItems(prev => prev.filter(it => it.id !== id));
                }}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function EnrollmentForm({ onSubmit }) {
  const [form, setForm] = useState({
    playerName: '', age: '', guardianName: '', contactPhone: '',
    division: 'T-Ball', notes: '', paid: false
  });
  const [busy, setBusy] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  return (
    <form onSubmit={async (e) => {
      e.preventDefault(); setBusy(true);
      try {
        await onSubmit({ ...form, age: Number(form.age) });
        setForm({ playerName: '', age: '', guardianName: '', contactPhone: '', division: 'T-Ball', notes: '', paid: false });
      } finally { setBusy(false); }
    }}>
      <div className="row">
        <input className="input" name="playerName" placeholder="Player name" value={form.playerName} onChange={handleChange} required />
        <input className="input" name="age" type="number" min="3" max="16" placeholder="Age" value={form.age} onChange={handleChange} required />
      </div>
      <div className="row">
        <input className="input" name="guardianName" placeholder="Guardian name" value={form.guardianName} onChange={handleChange} required />
        <input className="input" name="contactPhone" placeholder="Contact phone" value={form.contactPhone} onChange={handleChange} required />
      </div>
      <div className="row">
        <select className="select" name="division" value={form.division} onChange={handleChange}>
          <option>T-Ball</option><option>Coach Pitch</option><option>Minor</option><option>Major</option>
        </select>
        <label style={{display:'flex',alignItems:'center',gap:8}}>
          <input type="checkbox" name="paid" checked={form.paid} onChange={handleChange} />
          Paid?
        </label>
      </div>
      <textarea className="textarea" name="notes" rows="3" placeholder="Notes (allergies, jersey size, etc.)" value={form.notes} onChange={handleChange} />
      <div className="actions">
        <button className="btn btn--primary" disabled={busy}>Submit</button>
      </div>
    </form>
  );
}

function EnrollmentList({ items, onUpdate, onDelete }) {
  if (!items.length) return <p>No enrollments yet.</p>;
  return (
    <ul className="list">
      {items.map((it, idx) => (
        <li key={it.id ?? `${it.playerName}-${it.contactPhone}-${idx}`} className="item">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
            <div>
              <strong>{it.playerName}</strong> • Age {it.age} • {it.division}
              <div className="meta">Guardian: {it.guardianName} • {it.contactPhone}</div>
              {it.notes && <div className="meta" style={{marginTop:4}}>{it.notes}</div>}
            </div>
            <span className={`pill ${it.paid ? 'pill--paid' : 'pill--unpaid'}`}>{it.paid ? 'Paid' : 'Unpaid'}</span>
          </div>
          <div className="actions" style={{marginTop:8}}>
            <button className="btn btn--outline" disabled={!it.id} onClick={() => it.id && onUpdate(it.id, { paid: !it.paid })}>
              Toggle Paid
            </button>
            <button className="btn btn--outline" disabled={!it.id} onClick={() => it.id && onUpdate(it.id, { division: nextDivision(it.division) })}>
              Next Division
            </button>
            <button className="btn btn--primary" disabled={!it.id} onClick={() => it.id && onDelete(it.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function nextDivision(d) {
  const order = ['T-Ball','Coach Pitch','Minor','Major'];
  const i = order.indexOf(d);
  return order[(i + 1) % order.length];
}
