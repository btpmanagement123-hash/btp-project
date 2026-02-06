import { useState } from 'react';
import api from '../../api/axios';

const ProfessorChangePassword = () => {
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');

  // Visibility states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setMsg('New passwords do not match');
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword });
      setMsg('Password updated successfully.');
      setOld('');
      setNew('');
      setConfirm('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };
  

  const EyeIcon = ({ visible }) => (
    visible ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    )
  );
  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Change Password</h2>
      <p style={styles.subtitle}>
        Default password is temporary. Please set a strong password before proceeding.
      </p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Current Password */}
        <div style={styles.inputWrapper}>
          <input
            type={showOld ? "text" : "password"}
            placeholder="Current password"
            value={oldPassword}
            onChange={e => setOld(e.target.value)}
            style={styles.input}
            required
          />
          <button type="button" onClick={() => setShowOld(!showOld)} style={styles.eyeBtn}>
            <EyeIcon visible={showOld} />
          </button>
        </div>

        {/* New Password */}
        <div style={styles.inputWrapper}>
          <input
            type={showNew ? "text" : "password"}
            placeholder="New password"
            value={newPassword}
            onChange={e => setNew(e.target.value)}
            style={styles.input}
            required
          />
          <button type="button" onClick={() => setShowNew(!showNew)} style={styles.eyeBtn}>
            <EyeIcon visible={showNew} />
          </button>
        </div>

        {/* Confirm Password */}
        <div style={styles.inputWrapper}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={styles.input}
            required
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
            <EyeIcon visible={showConfirm} />
          </button>
        </div>

        {msg && (
          <p style={{
            ...styles.msg,
            borderColor: msg.includes('successfully') ? '#10b981' : '#ef4444',
            color: msg.includes('successfully') ? '#065f46' : '#b91c1c',
            backgroundColor: msg.includes('successfully') ? '#ecfdf5' : '#fef2f2'
          }}>
            {msg}
          </p>
        )}

        <button type="submit" style={styles.btn} disabled={saving}>
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '32px 24px',
    maxWidth: '400px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f5f9',
    margin: '40px auto',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  title: { 
    fontSize: '24px', 
    fontWeight: '700', 
    marginBottom: '8px', 
    color: '#111827',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '13px', 
    color: '#6b7280', 
    marginBottom: '24px',
    textAlign: 'center',
    lineHeight: '1.5'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '18px' 
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    padding: '12px 45px 12px 16px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
    outline: 'none',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease'
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    padding: '0'
  },
  msg: { 
    fontSize: '13px', 
    padding: '10px', 
    borderRadius: '8px',
    border: '1px solid transparent',
    textAlign: 'center'
  },
  btn: {
    marginTop: '10px',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: '#4f46e5', 
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)',
    transition: 'opacity 0.2s ease'
  }
};

export default ProfessorChangePassword;
