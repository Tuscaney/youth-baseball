import { useEffect, useState } from 'react';
import { listEnrollments, createEnrollment, updateEnrollment, deleteEnrollment } from './services/enrollments';

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listEnrollments();
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container" style={{ maxWidth: 980, margin: '0 auto', padding: 16, fontFamily: 'system-ui' }}>
      <header className="header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
        <h1 style={{ margin: 0, color: '#1e90ff' }}>Youth Baseball Enrollment</h1>
        <span style={{ fontSize: 12, opacity: .7 }}>Local Dev</span>
      </header>

      <div className="grid" style={{ display:'grid', gap:16, gridTemplateColumns: '1fr 1fr' }}>
        <section className="card" style={card}>
          <h2>New Enrollment</h2>
          <EnrollmentForm
            onSubmit={async (payload) => {
              const created = await createEnrollment(payload);
              setItems(prev => [created, ...prev]);
            }}
          />
        </section>

        <section className="card" style={card}>
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
  );
}

const card = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 2px 10px rgba(0,0,0,.04)' };

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
      e.preventDefault();
      setBusy(true);
      try {
        await onSubmit({ ...form, age: Number(form.age) });
        setForm({ playerName: '', age: '', guardianName: '', contactPhone: '', division: 'T-Ball', notes: '', paid: false });
      } finally { setBusy(false); }
    }}>
      <Row>
        <input className="input" name="playerName" placeholder="Player name" value={form.playerName} onChange={handleChange} required />
        <input className="input" name="age" type="number" min="3" max="16" placeholder="Age" value={form.age} onChange={handleChange} required />
      </Row>
      <Row>
        <input className="input" name="guardianName" placeholder="Guardian name" value={form.guardianName} onChange={handleChange} required />
        <input className="input" name="contactPhone" placeholder="Contact phone" value={form.contactPhone} onChange={handleChange} required />
      </Row>
      <Row>
        <select className="select" name="division" value={form.division} onChange={handleChange}>
          <option>T-Ball</option><option>Coach Pitch</option><option>Minor</option><option>Major</option>
        </select>
        <label style={{display:'flex',alignItems:'center',gap:8}}>
          <input type="checkbox" name="paid" checked={form.paid} onChange={handleChange} />
          Paid?
        </label>
      </Row>
      <textarea className="textarea" name="notes" rows="3" placeholder="Notes (allergies, jersey size, etc.)" value={form.notes} onChange={handleChange} />
      <div style={{display:'flex',gap:8,marginTop:12}}>
        <button className="btn" disabled={busy} style={btnPrimary}>Submit</button>
      </div>
    </form>
  );
}

function EnrollmentList({ items, onUpdate, onDelete }) {
  if (!items.length) return <p>No enrollments yet.</p>;
  return (
    <ul style={{listStyle:'none',padding:0,margin:0,display:'grid',gap:12}}>
      {items.map(it => (
        <li key={it.id} style={{...card, padding:12}}>
          <strong>{it.playerName}</strong> • Age {it.age} • {it.division} • {it.paid ? 'Paid' : 'Unpaid'}
          <div style={{opacity:.8, marginTop:4}}>
            Guardian: {it.guardianName} • {it.contactPhone}
          </div>
          {it.notes && <div style={{marginTop:4}}>{it.notes}</div>}
          <div style={{display:'flex',gap:8,marginTop:8, flexWrap:'wrap'}}>
            <button className="btn" style={btnOutline} onClick={() => onUpdate(it.id, { paid: !it.paid })}>
              Toggle Paid
            </button>
            <button className="btn" style={btnOutline} onClick={() => onUpdate(it.id, { division: nextDivision(it.division) })}>
              Next Division
            </button>
            <button className="btn" style={btnPrimary} onClick={() => onDelete(it.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Row({ children }) {
  return <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr', margin:'8px 0'}}>{children}</div>;
}

function nextDivision(d) {
  const order = ['T-Ball','Coach Pitch','Minor','Major'];
  const i = order.indexOf(d);
  return order[(i + 1) % order.length];
}

const btnPrimary = { border:'none', padding:'10px 14px', borderRadius:10, cursor:'pointer', background:'#1e90ff', color:'#fff', fontWeight:600 };
const btnOutline = { ...btnPrimary, background:'#fff', color:'#1e90ff', border:'2px solid #1e90ff' };

