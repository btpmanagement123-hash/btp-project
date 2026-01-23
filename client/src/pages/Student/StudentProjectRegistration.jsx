// client/src/pages/Student/StudentProjectRegistration.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentProjectRegistration = () => {
  const [me, setMe] = useState(null);
  const [profs, setProfs] = useState([]);
  const [selectedProf, setSelectedProf] = useState('');
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState([]);
  const [maxGroupSize, setMaxGroupSize] = useState(3);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, cfgRes, profRes] = await Promise.all([
          api.get('/student/me'),
          api.get('/student/btp-config'),
          api.get('/student/available-professors')
        ]);
        setMe(meRes.data);
        setMaxGroupSize(cfgRes.data?.maxGroupSize || 3);
        setProfs(profRes.data || []);
      } catch (err) {
        console.error('student reg init error', err);
        setError('Could not load registration data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (me) {
      setMembers([
        {
          name: me.name,
          roll: me.userId || '',
          isSelf: true
        }
      ]);
    }
  }, [me]);

  const addMember = () => {
    if (members.length >= maxGroupSize) return;
    setMembers([...members, { name: '', roll: '', isSelf: false }]);
  };

  const updateMember = (idx, field, value) => {
    const copy = [...members];
    copy[idx][field] = value;
    setMembers(copy);
  };

  const remainingSlots = maxGroupSize - members.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    try {
      const payload = {
        professorId: selectedProf,
        title,
        members: members.map((m) => ({
          name: m.name,
          roll: m.roll
        }))
      };

      const res = await api.post('/student/group-requests', payload);
      setMsg('Group request submitted. Ask your teammates to accept it.');
      console.log('group-request created', res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not register group.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!me) return <p>{error || 'Could not load profile.'}</p>;

  return (
    <div>
      <h2 style={styles.title}>BTP Group Registration</h2>

      {/* Submitting member profile */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Your Profile (Submitting Member)</h3>
        <div style={styles.row}>
          <span style={styles.label}>Name</span>
          <span style={styles.value}>{me.name}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Roll Number</span>
          <span style={styles.value}>{me.userId || '-'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Email</span>
          <span style={styles.value}>{me.email}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
        {/* Group members */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              Group Members ({members.length}/{maxGroupSize})
            </h3>
            <span style={styles.smallMuted}>
              You + up to {maxGroupSize - 1} more members
            </span>
          </div>

          {members.map((m, idx) => (
            <div key={idx} style={styles.memberRow}>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>
                  Member {idx + 1} Name
                </label>
                <input
                  type="text"
                  value={m.name}
                  disabled={m.isSelf}
                  onChange={(e) => updateMember(idx, 'name', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>Roll Number</label>
                <input
                  type="text"
                  value={m.roll}
                  disabled={m.isSelf}
                  onChange={(e) => updateMember(idx, 'roll', e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          ))}

          {remainingSlots > 0 && (
            <button
              type="button"
              onClick={addMember}
              style={styles.addBtn}
            >
              + Add Group Member ({remainingSlots} slot(s) remaining)
            </button>
          )}
        </div>

        {/* Supervisor selection + title */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Supervisor & Project</h3>

          <label style={styles.fieldLabel}>Preferred Supervisor</label>
          <select
            value={selectedProf}
            onChange={(e) => setSelectedProf(e.target.value)}
            style={styles.input}
          >
            <option value="">Select supervisor</option>
            {profs.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} · {p.department}
              </option>
            ))}
          </select>

          <label style={styles.fieldLabel}>Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            placeholder="AI-driven BTP Workflow Management System"
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {msg && <p style={styles.success}>{msg}</p>}

        <button type="submit" disabled={saving} style={styles.submitBtn}>
          {saving ? 'Submitting...' : 'Confirm BTP Group Members'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  title: { fontSize: 22, fontWeight: 700, marginBottom: 16 },
  card: {
    background: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
  },
  cardTitle: { fontSize: 15, fontWeight: 600, marginBottom: 10 },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10
  },
  smallMuted: { fontSize: 12, color: '#9ca3af' },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    padding: '6px 0',
    borderBottom: '1px dashed #e5e7eb'
  },
  label: { color: '#6b7280' },
  value: { color: '#111827', fontWeight: 500 },
  memberRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 10
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    display: 'block'
  },
  input: {
    width: '100%',
    padding: '9px 11px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    fontSize: 14
  },
  addBtn: {
    marginTop: 6,
    padding: '8px 10px',
    borderRadius: 999,
    border: '1px dashed #4f46e5',
    background: '#eef2ff',
    color: '#4f46e5',
    fontSize: 13,
    cursor: 'pointer'
  },
  error: { fontSize: 13, color: '#dc2626', marginTop: 6 },
  success: { fontSize: 13, color: '#16a34a', marginTop: 6 },
  submitBtn: {
    marginTop: 8,
    padding: '10px 0',
    width: '100%',
    maxWidth: 360,
    borderRadius: 999,
    border: 'none',
    background: '#22c55e',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default StudentProjectRegistration;
