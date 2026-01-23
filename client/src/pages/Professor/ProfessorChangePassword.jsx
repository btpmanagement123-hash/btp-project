import { useState } from 'react';
import api from '../../api/axios';

const ProfessorChangePassword = () => {
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
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
      setMsg('Password changed successfully. You can now use the new password.');
      setOld('');
      setNew('');
      setConfirm('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Change Password</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
        Default password is temporary. Please set a strong password before proceeding.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="password"
          placeholder="Current password"
          value={oldPassword}
          onChange={e => setOld(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNew(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          style={styles.input}
          required
        />
        {msg && <p style={styles.msg}>{msg}</p>}
        <button type="submit" style={styles.btn} disabled={saving}>
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    background: '#fff',
    borderRadius: 18,
    padding: 24,
    maxWidth: 420,
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
  },
  title: { fontSize: 20, fontWeight: 600, marginBottom: 8 },
  form: { display: 'flex', flexDirection: 'column', gap: 10 },
  input: {
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    fontSize: 14
  },
  msg: { fontSize: 13, color: '#4b5563' },
  btn: {
    marginTop: 4,
    padding: '9px 0',
    borderRadius: 10,
    border: 'none',
    background: '#111827',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default ProfessorChangePassword;
