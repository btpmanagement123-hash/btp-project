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
      setInfo('Notification created');
      setTitle('');
      setMessage('');
      setValidTill('');
    } catch (err) {
      setInfo(err.response?.data?.message || 'Failed to create notification');
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Create Notification</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Audience</label>
            <select
              value={audience}
              onChange={e => setAudience(e.target.value)}
              style={styles.input}
            >
              <option value="all">All</option>
              <option value="students">Students</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Session (optional)</label>
            <input
              style={styles.input}
              placeholder="2025-2026"
              value={session}
              onChange={e => setSession(e.target.value)}
            />
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Valid till (optional)</label>
            <input
              type="date"
              style={styles.input}
              value={validTill}
              onChange={e => setValidTill(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={styles.label}>Title</label>
          <input
            style={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={styles.label}>Message</label>
          <textarea
            rows={3}
            style={{ ...styles.input, resize: 'vertical' }}
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>

        {info && <p style={styles.msg}>{info}</p>}

        <button type="submit" style={styles.btn}>
          Save Notification
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    maxWidth: '800px', // Centers the form for better readability
    margin: '0 auto'
  },
  title: { 
    fontSize: '22px', 
    fontWeight: '700', 
    marginBottom: '24px', 
    color: '#0f172a',
    letterSpacing: '-0.02em'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  col: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px' 
  },
  label: { 
    fontSize: '13px', 
    fontWeight: '600', 
    color: '#64748b',
    marginLeft: '4px' 
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    color: '#1e293b',
    background: '#fcfcfd',
    outline: 'none',
    transition: 'all 0.2s ease',
    // Focus state logic would usually go in a CSS file, 
    // but we can make the base state look great here.
  },
  msg: { 
    fontSize: '14px', 
    color: '#059669', // Default to a success green
    background: '#ecfdf5',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #d1fae5',
    textAlign: 'center',
    fontWeight: '500'
  },
  btn: {
    marginTop: '12px',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: '#0f172a', 
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }
};

export default AdminNotifications;
