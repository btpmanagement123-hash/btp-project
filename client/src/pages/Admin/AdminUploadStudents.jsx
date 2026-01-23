// import { useState } from 'react';
// import api from '../../api/axios';

// const AdminUploadStudents = () => {
//   const [file, setFile] = useState(null);
//   const [msg, setMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;
//     setLoading(true);
//     setMsg('');

//     try {
//       const formData = new FormData();
//       formData.append('excel', file);
//       const res = await api.post('/admin/upload-students', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setMsg(`Uploaded ${res.data.count} students successfully.`);
//     } catch (err) {
//       setMsg(err.response?.data?.message || 'Upload failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.wrapper}>
//       <h2 style={styles.title}>Upload Students</h2>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <input
//           type="file"
//           accept=".xlsx,.xls"
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         {msg && <p style={styles.msg}>{msg}</p>}
//         <button type="submit" style={styles.btn} disabled={!file || loading}>
//           {loading ? 'Uploading...' : 'Upload Excel'}
//         </button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   wrapper: { background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' },
//   title: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
//   form: { display: 'flex', flexDirection: 'column', gap: 12 },
//   msg: { fontSize: 13, color: '#4b5563' },
//   btn: {
//     marginTop: 8,
//     width: 160,
//     padding: '8px 0',
//     borderRadius: 8,
//     border: 'none',
//     background: '#4f46e5',
//     color: '#fff',
//     fontWeight: 600,
//     cursor: 'pointer'
//   }
// };

// export default AdminUploadStudents;
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
    background: '#fff',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
  },
  title: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  msg: { fontSize: 13, color: '#4b5563' },
  btn: {
    marginTop: 8,
    width: 160,
    padding: '8px 0',
    borderRadius: 8,
    border: 'none',
    background: '#4f46e5',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default AdminUploadStudents;
