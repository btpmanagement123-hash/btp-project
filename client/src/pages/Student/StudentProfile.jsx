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

  if (loading) return <p style={styles.smallMuted}>Loading profile...</p>;
  if (!student) return <p style={styles.smallMuted}>Could not load profile.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Profile</h2>

      {/* Status Badge Row */}
      <div style={styles.badgeRow}>
        <span style={styles.statusBadge(student.isActive)}>
          {student.isActive ? 'Active' : 'Inactive'}
        </span>
        <span style={styles.smallMuted}>
          {student.department} · {student.session}
        </span>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardHeading}>{student.name}</h3>
        
        {/* Academic Details Section */}
        <h4 style={styles.sectionTitle}>Academic Details</h4>
        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Roll Number</span>
          <span style={styles.metaValue}>{student.userId || '-'}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Current Semester</span>
          <span style={styles.metaValue}>{student.semester || '-'}</span>
        </div>

        {/* Contact Details Section */}
        <h4 style={{ ...styles.sectionTitle, marginTop: '2rem' }}>Contact Information</h4>
        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Official Email</span>
          <span style={styles.metaValue}>{student.email}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Phone / Mobile</span>
          <span style={styles.metaValue}>{student.mobile || 'Not provided'}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  title: { 
    fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', 
    fontWeight: '800', 
    marginBottom: '1rem', 
    color: '#0f172a',
    letterSpacing: '-0.025em'
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  statusBadge: (isActive) => ({
    padding: '0.375rem 0.875rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    background: isActive ? '#ecfdf5' : '#fff1f2',
    color: isActive ? '#059669' : '#e11d48',
    border: `1px solid ${isActive ? '#10b98133' : '#f43f5e33'}`
  }),
  smallMuted: { 
    fontSize: '0.875rem', 
    color: '#64748b',
    fontWeight: '500'
  },
  card: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: 'clamp(1.25rem, 5vw, 2rem)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9',
    width: '100%',
    boxSizing: 'border-box'
  },
  cardHeading: { 
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', 
    fontWeight: '800', 
    marginBottom: '1.5rem', 
    color: '#1e293b',
    lineHeight: '1.3'
  },
  sectionTitle: { 
    fontSize: '0.8125rem', 
    fontWeight: '700', 
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9375rem',
    padding: '0.875rem 0',
    borderBottom: '1px solid #f8fafc'
  },
  metaLabel: { 
    color: '#64748b', 
    fontWeight: '500',
    flexShrink: 0
  },
  metaValue: { 
    color: '#334155', 
    fontWeight: '700',
    textAlign: 'right',
    wordBreak: 'break-word'
  },
};

export default StudentProfile;