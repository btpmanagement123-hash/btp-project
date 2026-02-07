import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminUploadStudents = () => {
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
      const res = await api.post('/admin/upload-students', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg(
        `Uploaded ${res.data.success} students for ${activeSession.session} (${activeSession.semester}).`
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
      <h2 style={styles.title}>Upload Students</h2>
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
    padding: 'clamp(16px, 5vw, 32px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    maxWidth: '600px',
    margin: '20px auto',
    width: 'calc(100% - 32px)',
    boxSizing: 'border-box'
  },
  title: { 
    fontSize: 'clamp(18px, 4vw, 22px)', 
    fontWeight: '700', 
    marginBottom: '20px', 
    color: '#0f172a',
    letterSpacing: '-0.02em'
  },
  statusBox: {
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px',
    wordBreak: 'break-word'
  },
  activeSession: {
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #dbeafe'
  },
  noSession: {
    background: '#fff1f2',
    color: '#be123c',
    border: '1px solid #ffe4e6'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  fileInput: {
    padding: 'clamp(30px, 8vw, 50px) 20px',
    border: '2px dashed #e2e8f0',
    borderRadius: '16px',
    background: '#f8fafc',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '16px',
    color: '#64748b',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  msg: { 
    fontSize: '14px', 
    color: '#475569',
    background: '#f1f5f9',
    padding: '12px 16px',
    borderRadius: '10px',
    lineHeight: '1.5',
    borderLeft: '4px solid #4f46e5'
  },
  btn: {
    marginTop: '8px',
    padding: '14px 0',
    borderRadius: '12px',
    border: 'none',
    background: '#4f46e5',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
    display: 'block',
    width: '100%',
    WebkitTapHighlightColor: 'transparent'
  },
  disabledBtn: {
    background: '#94a3b8',
    cursor: 'not-allowed',
    boxShadow: 'none',
    opacity: 0.7
  }
};

export default AdminUploadStudents;
