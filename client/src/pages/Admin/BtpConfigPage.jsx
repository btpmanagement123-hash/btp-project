// client/src/pages/Admin/BtpConfigPage.jsx
import { useState } from 'react';
import api from '../../api/axios';

const BtpConfigPage = () => {
  const [session, setSession] = useState('2025-2026');
  const [maxMembers, setMaxMembers] = useState(4);
  const [maxSup, setMaxSup] = useState(1);
  const [deadline, setDeadline] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

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
          maxGroupSize: Number(maxMembers),
          maxGroupsPerProfessor: Number(maxSup),
          registrationDeadline: deadline || null
        }
      });
      setMsg('BTP settings saved successfully');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>BTP Configuration Settings</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Academic Session</label>
        <input
          style={styles.input}
          value={session}
          onChange={(e) => setSession(e.target.value)}
        />

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Max Supervisors per Group</label>
            <input
              type="number"
              min="1"
              style={styles.input}
              value={maxSup}
              onChange={(e) => setMaxSup(e.target.value)}
            />
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Max Members per Group</label>
            <input
              type="number"
              min="1"
              style={styles.input}
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.col}>
          <label style={styles.label}>BTP Registration Deadline</label>
          <input
            type="date"
            style={styles.input}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {msg && <p style={styles.msg}>{msg}</p>}

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Saving...' : 'Save BTP Settings'}
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
    background: '#4b5563',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default BtpConfigPage;
