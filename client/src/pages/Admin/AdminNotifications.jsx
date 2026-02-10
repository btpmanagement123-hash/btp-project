import { useState } from 'react';
import api from '../../api/axios';

const AdminNotifications = () => {
  const [audience, setAudience] = useState('all');
  const [session, setSession] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [validTill, setValidTill] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setInfo('');
    try {
      await api.post('/admin/notifications', {
        audience,
        session: session || null,
        title,
        message,
        validTill: validTill || null
      });
      setInfo('Notification created successfully');
      setTitle('');
      setMessage('');
      setValidTill('');
    } catch (err) {
      setInfo(err.response?.data?.message || 'Failed to create notification');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Notifications</h2>
      <p style={styles.smallMuted}>Create and broadcast alerts for the system.</p>
      
      <div style={styles.card}>
        <h3 style={styles.cardHeading}>Compose Broadcast</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Audience</label>
              <select
                value={audience}
                onChange={e => setAudience(e.target.value)}
                style={styles.input}
              >
                <option value="all">Global (All Users)</option>
                <option value="students">Students Only</option>
                <option value="faculty">Faculty Only</option>
              </select>
            </div>
            
            <div style={styles.col}>
              <label style={styles.label}>Academic Session</label>
              <input
                style={styles.input}
                placeholder="e.g. 2025-2026"
                value={session}
                onChange={e => setSession(e.target.value)}
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Valid Until</label>
              <input
                type="date"
                style={styles.input}
                value={validTill}
                onChange={e => setValidTill(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Notification Title</label>
            <input
              style={styles.input}
              placeholder="e.g. Registration Deadline Extended"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={styles.label}>Detailed Message</label>
            <textarea
              rows={4}
              style={{ ...styles.input, resize: 'none' }}
              placeholder="Enter the full content of your announcement..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>

          {info && (
            <div style={info.includes('success') ? styles.successMsg : styles.errorMsg}>
              {info}
            </div>
          )}

          <button type="submit" style={styles.btn}>
            Broadcast Notification
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    width: '100%', 
    maxWidth: '100%' 
  },
  pageTitle: { 
    fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', 
    fontWeight: '800', 
    marginBottom: '0.5rem', 
    color: '#0f172a',
    letterSpacing: '-0.025em'
  },
  smallMuted: { 
    fontSize: '0.875rem', 
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '2rem',
    display: 'block'
  },
  card: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9',
    boxSizing: 'border-box'
  },
  cardHeading: {
    fontSize: '1.125rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1.25rem' 
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem'
  },
  col: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.5rem' 
  },
  label: { 
    fontSize: '0.8125rem', 
    fontWeight: '700', 
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  input: {
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '0.9375rem', 
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    width: '100%',
    boxSizing: 'border-box'
  },
  successMsg: { 
    fontSize: '0.875rem', 
    color: '#059669',
    background: '#ecfdf5',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #10b98133',
    fontWeight: '600'
  },
  errorMsg: { 
    fontSize: '0.875rem', 
    color: '#dc2626',
    background: '#fef2f2',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #fecaca',
    fontWeight: '600'
  },
  btn: {
    marginTop: '0.5rem',
    padding: '1rem',
    borderRadius: '12px',
    border: 'none',
    background: '#6366f1', 
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.1s ease, background 0.2s ease',
    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
    width: '100%'
  }
};

export default AdminNotifications;