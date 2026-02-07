
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const CreateSessionPage = () => {
  const [session, setSession] = useState('');

  const [oddStart, setOddStart] = useState('');
  const [oddEnd, setOddEnd] = useState('');
  const [evenStart, setEvenStart] = useState('');
  const [evenEnd, setEvenEnd] = useState('');

  const [semester, setSemester] = useState('AUTO');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // 🔄 Load active session + live semester
  useEffect(() => {
    const loadActive = async () => {
      try {
        const res = await api.get('/admin/active-session');
        if (res.data?.session) {
          setSession(res.data.session);
          setSemester(res.data.semester?.toUpperCase() || 'AUTO');

          const cfg = res.data.config || {};
          setOddStart(cfg.oddStart?.slice(0, 10) || '');
          setOddEnd(cfg.oddEnd?.slice(0, 10) || '');
          setEvenStart(cfg.evenStart?.slice(0, 10) || '');
          setEvenEnd(cfg.evenEnd?.slice(0, 10) || '');
        }
      } catch (err) {
        // no active session yet — ignore
      }
    };
    loadActive();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');

    // 🛑 Basic validation
    if (!oddStart || !oddEnd || !evenStart || !evenEnd) {
      setError('Please enter all Odd and Even semester dates');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/admin/session-config', {
        session,
        config: {
          oddStart,
          oddEnd,
          evenStart,
          evenEnd
        }
      });

      setSemester(res.data.semester?.toUpperCase() || 'AUTO');
      setMsg(
        `Session saved. Current system semester: ${res.data.semester?.toUpperCase()}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create session'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Create Academic Session</h2>

        {/* 🟢 LIVE SEMESTER BADGE */}
        <div style={styles.semesterBadge}>
          Current System Semester:{' '}
          <span
            style={{
              ...styles.badge,
              background:
                semester === 'ODD'
                  ? '#ecfeff'
                  : semester === 'EVEN'
                  ? '#eef2ff'
                  : '#fff7ed',
              color:
                semester === 'ODD'
                  ? '#0369a1'
                  : semester === 'EVEN'
                  ? '#4338ca'
                  : '#9a3412'
            }}
          >
            {semester}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Academic Session</label>
          <input
            style={styles.input}
            placeholder="e.g., 2025-2026"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            required
          />

          {/* 📅 ODD SEMESTER */}
          <div style={styles.sectionTitle}>Odd Semester Dates</div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                style={styles.input}
                value={oddStart}
                onChange={(e) => setOddStart(e.target.value)}
                required
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                style={styles.input}
                value={oddEnd}
                onChange={(e) => setOddEnd(e.target.value)}
                required
              />
            </div>
          </div>

          {/* 📅 EVEN SEMESTER */}
          <div style={styles.sectionTitle}>Even Semester Dates</div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                style={styles.input}
                value={evenStart}
                onChange={(e) => setEvenStart(e.target.value)}
                required
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                style={styles.input}
                value={evenEnd}
                onChange={(e) => setEvenEnd(e.target.value)}
                required
              />
            </div>
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
            {loading ? 'Saving...' : 'Save Session & Dates'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '750px',
    margin: '0 auto',
    padding: 'clamp(12px, 4vw, 24px) 16px',
    boxSizing: 'border-box'
  },
  wrapper: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: 'clamp(20px, 6vw, 40px)',
    boxShadow: '0 4px 25px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9',
    width: '100%',
    boxSizing: 'border-box'
  },
  title: {
    fontSize: 'clamp(20px, 5vw, 24px)',
    fontWeight: '700',
    marginBottom: '8px',
    textAlign: 'center',
    color: '#0f172a',
    letterSpacing: '-0.02em'
  },
  semesterBadge: {
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '32px',
    color: '#64748b',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  badge: {
    padding: '6px 14px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '12px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    border: '1px solid transparent',
    whiteSpace: 'nowrap'
  },
  sectionTitle: {
    marginTop: '12px',
    paddingBottom: '8px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
    borderBottom: '2px solid #f1f5f9',
    marginBottom: '4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '4px'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
    boxSizing: 'border-box'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '20px',
    width: '100%'
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  success: {
    fontSize: '14px',
    color: '#059669',
    background: '#ecfdf5',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #d1fae5',
    textAlign: 'center',
    fontWeight: '500',
    wordBreak: 'break-word'
  },
  error: {
    fontSize: '14px',
    color: '#dc2626',
    background: '#fef2f2',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #fee2e2',
    textAlign: 'center',
    fontWeight: '500',
    wordBreak: 'break-word'
  },
  submitBtn: {
    marginTop: '16px',
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    background: '#4f46e5',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
    width: '100%',
    WebkitTapHighlightColor: 'transparent'
  }
};

export default CreateSessionPage;
