
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminUploadFaculty = () => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/active-session');
        setActiveSession(res.data);
      } catch {
        setActiveSession(null);
      }
    };
    load();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file || !activeSession) return;
    setLoading(true);
    setMsg('');
    try {
      const formData = new FormData();
      formData.append('excel', file);
      const res = await api.post('/admin/upload-faculty', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg(
        `Uploaded ${res.data.success} faculty for ${activeSession.session} (${activeSession.semester}).`
      );
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const disabled = !file || !activeSession || loading;

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Upload Faculty</h2>
      {!activeSession && (
        <p style={{ color: '#b91c1c', marginBottom: 8 }}>
          No active session. Please create a session first from Settings → System
          Configuration.
        </p>
      )}
      {activeSession && (
        <p style={{ fontSize: 13, marginBottom: 8 }}>
          Active session: <b>{activeSession.session}</b> ({activeSession.semester})
        </p>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={e => setFile(e.target.files[0])}
        />
        {msg && <p style={styles.msg}>{msg}</p>}
        <button type="submit" style={styles.btn} disabled={disabled}>
          {loading ? 'Uploading...' : 'Upload Excel'}
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
    maxWidth: '600px', // Keeps the upload area focused
    margin: '0 auto'
  },
  title: { 
    fontSize: '22px', 
    fontWeight: '700', 
    marginBottom: '20px', 
    color: '#0f172a',
    letterSpacing: '-0.02em'
  },
  sessionBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '10px',
    background: '#f0f9ff',
    border: '1px solid #e0f2fe',
    color: '#0369a1',
    fontSize: '14px',
    marginBottom: '24px'
  },
  errorBanner: {
    padding: '12px 16px',
    borderRadius: '10px',
    background: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#b91c1c',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '24px'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  fileInput: {
    padding: '30px',
    border: '2px dashed #e2e8f0',
    borderRadius: '12px',
    background: '#f8fafc',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'border-color 0.2s ease'
  },
  msg: { 
    fontSize: '14px', 
    color: '#475569',
    background: '#f1f5f9',
    padding: '12px',
    borderRadius: '8px',
    borderLeft: '4px solid #64748b'
  },
  btn: {
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    background: '#0f172a', 
    color: '#fff',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  disabledBtn: {
    background: '#94a3b8',
    cursor: 'not-allowed',
    boxShadow: 'none'
  }
};

export default AdminUploadFaculty;
