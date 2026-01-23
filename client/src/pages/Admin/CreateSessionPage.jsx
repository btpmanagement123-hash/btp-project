// client/src/pages/Admin/CreateSessionPage.jsx
import { useState } from 'react';
import api from '../../api/axios';

const CreateSessionPage = () => {
  const [session, setSession] = useState('');
  const [oddStart, setOddStart] = useState('');
  const [oddEnd, setOddEnd] = useState('');
  const [evenStart, setEvenStart] = useState('');
  const [evenEnd, setEvenEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await api.post('/admin/session-config', {
        session,
        semester: 'odd',
        status: 'active',
        config: {
          minGroupSize: 1,
          maxGroupSize: 4,
          maxGroupsPerProfessor: 10
        }
      });
      setMsg('Session created / updated successfully');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to save session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Create New Academic Session</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Academic Session</label>
        <input
          style={styles.input}
          placeholder="e.g., 2025-2026"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          required
        />

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Odd Semester Start</label>
            <input
              type="date"
              style={styles.input}
              value={oddStart}
              onChange={(e) => setOddStart(e.target.value)}
            />
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Odd Semester End</label>
            <input
              type="date"
              style={styles.input}
              value={oddEnd}
              onChange={(e) => setOddEnd(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Even Semester Start</label>
            <input
              type="date"
              style={styles.input}
              value={evenStart}
              onChange={(e) => setEvenStart(e.target.value)}
            />
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Even Semester End</label>
            <input
              type="date"
              style={styles.input}
              value={evenEnd}
              onChange={(e) => setEvenEnd(e.target.value)}
            />
          </div>
        </div>

        {msg && <p style={styles.msg}>{msg}</p>}

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Saving...' : 'Create Session'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    background: '#ffffff',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
  },
  title: { fontSize: 20, fontWeight: 600, marginBottom: 18 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  label: { fontSize: 13, fontWeight: 500, color: '#4b5563' },
  input: {
    padding: '9px 12px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    fontSize: 14
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
    gap: 12
  },
  col: { display: 'flex', flexDirection: 'column', gap: 6 },
  msg: { fontSize: 13, color: '#4b5563', marginTop: 4 },
  submitBtn: {
    marginTop: 10,
    padding: '10px 0',
    borderRadius: 10,
    border: 'none',
    background: '#4f46e5',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default CreateSessionPage;
