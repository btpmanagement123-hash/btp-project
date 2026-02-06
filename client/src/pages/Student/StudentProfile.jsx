import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/student/me');
        setStudent(res.data);
      } catch (err) {
        console.error('student me error', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!student) return <p>Could not load profile.</p>;

  return (
    <div>
      <h2 style={styles.name}>{student.name}</h2>
      <p style={styles.subTitle}>
        {student.department || 'Department'} · {student.session || 'Session'}
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Academic Details</h3>
          <div style={styles.row}>
            <span style={styles.label}>Roll Number</span>
            <span style={styles.value}>{student.userId || '-'}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Section</span>
            <span style={styles.value}>{student.section || '-'}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Current Semester</span>
            <span style={styles.value}>{student.semester || '-'}</span>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Contact & Status</h3>
          <div style={styles.row}>
            <span style={styles.label}>Official Email</span>
            <span style={styles.value}>{student.email}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Phone</span>
            <span style={styles.value}>{student.mobile || '-'}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Account Status</span>
            <span
              style={{
                ...styles.badge,
                background: student.isActive ? '#dcfce7' : '#fee2e2',
                color: student.isActive ? '#16a34a' : '#b91c1c'
              }}
            >
              {student.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  name: { 
    fontSize: '32px', 
    fontWeight: '800', 
    color: '#0f172a',
    letterSpacing: '-0.025em',
    marginBottom: '4px'
  },
  subTitle: { 
    fontSize: '16px', 
    color: '#64748b', 
    marginBottom: '32px',
    fontWeight: '500' 
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '24px'
  },
  card: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s ease'
  },
  cardTitle: { 
    fontSize: '13px', 
    fontWeight: '700', 
    marginBottom: '20px', 
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    padding: '12px 0',
    borderBottom: '1px solid #f8fafc'
  },
  label: { 
    color: '#64748b', 
    fontWeight: '500' 
  },
  value: { 
    fontWeight: '700', 
    color: '#1e293b',
    textAlign: 'right' 
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  }
};

export default StudentProfile;
