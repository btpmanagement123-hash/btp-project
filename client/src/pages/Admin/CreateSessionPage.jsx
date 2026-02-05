
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

// 🎨 STYLES (RESPONSIVE + CLEAN ADMIN UI)
const styles = {
  page: {
    maxWidth: 700,
    margin: "0 auto",
    padding: "16px"
  },

  wrapper: {
    background: "#ffffff",
    borderRadius: 18,
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 10,
    textAlign: "center"
  },

  semesterBadge: {
    textAlign: "center",
    fontSize: 13,
    marginBottom: 18,
    color: "#374151"
  },

  badge: {
    padding: "4px 12px",
    borderRadius: 999,
    fontWeight: 600,
    marginLeft: 6
  },

  sectionTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: 600,
    color: "#374151"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14
  },

  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#4b5563"
  },

  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    width: "100%"
  },

  /* ⭐ RESPONSIVE GRID FIX */
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: 12
  },

  col: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },

  success: {
    fontSize: 13,
    color: "#16a34a",
    textAlign: "center"
  },

  error: {
    fontSize: 13,
    color: "#dc2626",
    textAlign: "center"
  },

  submitBtn: {
    marginTop: 14,
    padding: "12px",
    borderRadius: 999,
    border: "none",
    background: "#4f46e5",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%"
  }
};


export default CreateSessionPage;
