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
  title: { 
    fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', 
    fontWeight: '800', 
    marginBottom: '1.5rem', 
    color: '#0f172a',
    letterSpacing: '-0.025em'
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    marginBottom: '1.25rem',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)',
    boxSizing: 'border-box'
  },
  cardTitle: { 
    fontSize: '1rem', 
    fontWeight: '700', 
    marginBottom: '1rem', 
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #f8fafc'
  },
  smallMuted: { 
    fontSize: '0.75rem', 
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '4px 10px',
    borderRadius: '6px',
    whiteSpace: 'nowrap'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
    padding: '0.625rem 0',
    borderBottom: '1px solid #f8fafc'
  },
  label: { 
    color: '#94a3b8', 
    fontWeight: '500',
    flexShrink: 0 
  },
  value: { 
    color: '#1e293b', 
    fontWeight: '600',
    textAlign: 'right',
    wordBreak: 'break-word'
  },
  memberRow: {
    display: 'flex',
    flexDirection: 'column', // Stack on mobile
    gap: '12px',
    marginBottom: '1rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #eff6ff',
    // Media query logic usually happens in CSS, but for JS objects:
    '@media (min-width: 640px)': {
      flexDirection: 'row'
    }
  },
  fieldLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  addBtn: {
    marginTop: '0.5rem',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '2px dashed #cbd5e1',
    background: 'transparent',
    color: '#6366f1',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
  },
  error: { 
    fontSize: '0.875rem', 
    color: '#ef4444', 
    backgroundColor: '#fef2f2', 
    padding: '0.75rem', 
    borderRadius: '10px',
    borderLeft: '4px solid #ef4444',
    marginBottom: '1rem'
  },
  success: { 
    fontSize: '0.875rem', 
    color: '#10b981', 
    backgroundColor: '#f0fdf4', 
    padding: '0.75rem', 
    borderRadius: '10px', 
    borderLeft: '4px solid #10b981',
    marginBottom: '1rem'
  },
  submitBtn: {
    marginTop: '0.75rem',
    padding: '14px 28px',
    borderRadius: '12px',
    border: 'none',
    background: '#4f46e5',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
    width: '100%',
    boxSizing: 'border-box'
  }
};

export default StudentProjectRegistration;
