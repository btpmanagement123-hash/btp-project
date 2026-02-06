
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const BtpConfigPage = () => {
  const [session, setSession] = useState('');
  const [minMembers, setMinMembers] = useState(1);
  const [maxMembers, setMaxMembers] = useState(4);
  const [maxSup, setMaxSup] = useState(10);
  const [deadline, setDeadline] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // 🔄 Load active session automatically
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await api.get('/admin/active-session');
        setSession(res.data?.session || '');
      } catch (err) {
        setError('No active session found. Please create a session first.');
      }
    };
    loadSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');

    if (!session) {
      setError('Active session is required');
      setLoading(false);
      return;
    }

    if (minMembers > maxMembers) {
      setError('Min members cannot be greater than max members');
      setLoading(false);
      return;
    }

    try {
      await api.post('/admin/session-config', {
        session,
        config: {
          minGroupSize: Number(minMembers),
          maxGroupSize: Number(maxMembers),
          maxGroupsPerProfessor: Number(maxSup),
          registrationDeadline: deadline || null
        }
      });

      setMsg('BTP settings saved successfully');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to save settings'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>BTP Configuration Settings</h2>

        {/* 🟢 Active Session Badge */}
        {session && (
          <div style={styles.sessionBadge}>
            Active Session:{' '}
            <span style={styles.badge}>{session}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>
                Min Members per Group
              </label>
              <input
                type="number"
                min="1"
                max={maxMembers}
                style={styles.input}
                value={minMembers}
                onChange={(e) =>
                  setMinMembers(e.target.value)
                }
                required
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>
                Max Members per Group
              </label>
              <input
                type="number"
                min={minMembers}
                style={styles.input}
                value={maxMembers}
                onChange={(e) =>
                  setMaxMembers(e.target.value)
                }
                required
              />
            </div>
          </div>

          <div style={styles.col}>
            <label style={styles.label}>
              Max Groups per Professor
            </label>
            <input
              type="number"
              min="1"
              style={styles.input}
              value={maxSup}
              onChange={(e) => setMaxSup(e.target.value)}
              required
            />
          </div>

          <div style={styles.col}>
            <label style={styles.label}>
              BTP Registration Deadline
            </label>
            <input
              type="date"
              style={styles.input}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {msg && <p style={styles.success}>{msg}</p>}
          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save BTP Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '650px',
    margin: '0 auto',
    padding: '24px 16px'
  },
  wrapper: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9'
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '8px',
    textAlign: 'center',
    color: '#0f172a',
    letterSpacing: '-0.02em'
  },
  sessionBadge: {
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '28px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  badge: {
    background: '#f0f9ff',
    color: '#0369a1',
    padding: '4px 12px',
    borderRadius: '8px',
    border: '1px solid #e0f2fe',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    marginLeft: '2px'
  },
  input: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    background: '#fcfcfd',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    color: '#1e293b'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  success: {
    fontSize: '14px',
    color: '#059669',
    background: '#ecfdf5',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d1fae5',
    textAlign: 'center',
    fontWeight: '500'
  },
  error: {
    fontSize: '14px',
    color: '#dc2626',
    background: '#fef2f2',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #fee2e2',
    textAlign: 'center',
    fontWeight: '500'
  },
  submitBtn: {
    marginTop: '12px',
    padding: '14px 0',
    borderRadius: '12px',
    border: 'none',
    background: '#0f172a', // Matches the AdminLayout sidebar
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }
};

export default BtpConfigPage;
