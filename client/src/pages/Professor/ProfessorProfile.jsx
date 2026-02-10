import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/professor/me');
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    load();
  }, []);

  if (!profile) return (
    <div style={styles.loadingState}>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Profile</h2>
      <p style={styles.smallMuted}>Personal information and institutional records.</p>

      <div style={styles.topRow}>
        {/* Profile Identity Card */}
        <div style={styles.leftCard}>
          <div style={styles.avatarWrapper}>
            <img
              src={
                profile.photoUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'Professor')}&background=6366f1&color=fff`
              }
              alt="Profile"
              style={styles.avatar}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={styles.name}>{profile.name}</h3>
            <p style={styles.sub}>{profile.designation || 'Faculty Member'}</p>
            <p style={{ ...styles.sub, color: '#94a3b8', marginTop: '4px' }}>{profile.department}</p>
          </div>
        </div>

        {/* Contact Details Card */}
        <div style={styles.rightCard}>
          <h4 style={styles.sectionTitle}>Contact Information</h4>
          
          <div style={styles.metaBlock}>
            <p style={styles.label}>Official Email</p>
            <p style={styles.value}>{profile.email}</p>
          </div>

          <div style={styles.metaBlock}>
            <p style={styles.label}>Mobile / Extension</p>
            <p style={styles.value}>{profile.mobile || 'Not provided'}</p>
          </div>

          <div style={styles.metaBlock}>
            <p style={styles.label}>Account Status</p>
            <div style={{ display: 'flex', marginTop: '8px' }}>
               <span style={styles.statusBadge(profile.isActive)}>
                 {profile.isActive ? 'Active Access' : 'Inactive'}
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Info Card */}
      <div style={styles.fullCard}>
        <h4 style={styles.sectionTitle}>Institutional Records</h4>
        
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Staff Employee ID</span>
          <span style={styles.infoValue}>{profile.staffId || profile.userId}</span>
        </div>
        
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Primary Department</span>
          <span style={styles.infoValue}>{profile.department}</span>
        </div>
        
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Current Academic Session</span>
          <span style={styles.infoValue}>{profile.session}</span>
        </div>

        <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
          <span style={styles.infoLabel}>Role Permissions</span>
          <span style={styles.infoValue}>Professor / Guide</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', maxWidth: '100%' },
  loadingState: { display: 'flex', justifyContent: 'center', padding: '100px', color: '#64748b' },
  title: { 
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
  topRow: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '1.5rem' 
  },
  leftCard: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
    gap: '1.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9',
    boxSizing: 'border-box'
  },
  avatarWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    height: '110px',
    width: '110px',
    borderRadius: '2rem', 
    objectFit: 'cover',
    border: '4px solid #f8fafc',
    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)'
  },
  name: { 
    fontSize: '1.5rem', 
    fontWeight: '800', 
    color: '#1e293b', 
    margin: '0 0 4px 0'
  },
  sub: { fontSize: '0.875rem', color: '#64748b', fontWeight: '500' },
  rightCard: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9',
    boxSizing: 'border-box'
  },
  fullCard: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9',
    marginTop: '1.5rem',
    boxSizing: 'border-box'
  },
  sectionTitle: { 
    fontSize: '0.8125rem', 
    fontWeight: '700', 
    color: '#94a3b8', 
    textTransform: 'uppercase', 
    letterSpacing: '0.1em',
    marginBottom: '1.5rem',
    display: 'block'
  },
  metaBlock: { marginBottom: '1.25rem' },
  label: { fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' },
  value: { fontSize: '1rem', fontWeight: '700', color: '#334155', wordBreak: 'break-all' },
  statusBadge: (isActive) => ({
    padding: '0.375rem 0.875rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    background: isActive ? '#ecfdf5' : '#fff1f2',
    color: isActive ? '#059669' : '#e11d48',
    border: `1px solid ${isActive ? '#10b98133' : '#f43f5e33'}`
  }),
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    borderBottom: '1px solid #f8fafc'
  },
  infoLabel: { color: '#64748b', fontWeight: '500' },
  infoValue: { color: '#1e293b', fontWeight: '800' }
};

export default ProfessorProfile;