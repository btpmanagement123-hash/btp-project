import { useState } from 'react';
import api from '../../api/axios';

const StudentChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setMsg('');
    setError('');

    try {
      await api.post('/auth/change-password', {
        oldPassword,
        newPassword
      });
      setMsg('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Professional Eye Icon Component (SVG)
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
    <div style={styles.container}>
      <h2 style={styles.title}>Change Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* Current Password */}
        <div style={styles.inputWrapper}>
          <input
            type={showOld ? "text" : "password"}
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
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
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
            <EyeIcon visible={showConfirm} />
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {msg && <p style={styles.success}>{msg}</p>}

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '32px 24px',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: '40px auto',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  title: { 
    fontSize: '24px', 
    fontWeight: '700', 
    marginBottom: '24px', 
    color: '#111827',
    textAlign: 'center' 
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
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box'
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
    padding: '0',
    transition: 'color 0.2s ease'
  },
  btn: {
    marginTop: '10px',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: '#4f46e5',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)'
  },
  error: { 
    fontSize: '13px', 
    color: '#b91c1c', 
    backgroundColor: '#fef2f2', 
    padding: '10px', 
    borderRadius: '8px',
    border: '1px solid #fee2e2'
  },
  success: { 
    fontSize: '13px', 
    color: '#065f46', 
    backgroundColor: '#ecfdf5', 
    padding: '10px', 
    borderRadius: '8px',
    border: '1px solid #d1fae5'
  }
};

export default StudentChangePassword;