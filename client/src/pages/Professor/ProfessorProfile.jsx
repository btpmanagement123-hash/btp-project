
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

  
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD || '';
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_PRESET || '';

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

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !cloudName || !uploadPreset) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await cloudRes.json();
      const url = data.secure_url;
      if (!url) throw new Error('Upload failed');

      const uRes = await api.post('/professor/profile/photo', { photoUrl: url });
      setProfile(uRes.data);
    } catch (err) {
      console.error('Photo upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', color: '#64748b' }}>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={styles.title}>Faculty Profile</h2>

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
            <label style={styles.uploadLabel}>
              {uploading ? 'Processing...' : 'Change Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
          </div>
          <div>
            <h3 style={styles.name}>{profile.name}</h3>
            <p style={styles.sub}>{profile.designation || 'Faculty Member'}</p>
            <p style={{ ...styles.sub, color: '#94a3b8', marginTop: '4px' }}>{profile.department}</p>
          </div>
        </div>

        {/* Contact Details Card */}
        <div style={styles.rightCard}>
          <h4 style={styles.sectionTitle}>Contact Information</h4>
          
          <p style={styles.label}>Official Email</p>
          <p style={styles.value}>{profile.email}</p>

          <p style={styles.label}>Mobile / Extension</p>
          <p style={styles.value}>{profile.mobile || 'Not provided'}</p>

          <p style={styles.label}>Account Status</p>
          <div style={{ display: 'flex', marginTop: '4px' }}>
             <span style={{
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '6px',
                background: profile.isActive ? '#dcfce7' : '#fee2e2',
                color: profile.isActive ? '#16a34a' : '#dc2626'
             }}>
               {profile.isActive ? 'Active Access' : 'Inactive'}
             </span>
          </div>
        </div>
      </div>

      {/* Institutional Info Card */}
      <div style={styles.bottomRow}>
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

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Role Permissions</span>
            <span style={styles.infoValue}>Professor / Guide</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Page Title
  title: { 
    fontSize: 'clamp(22px, 5vw, 28px)', 
    fontWeight: '800', 
    color: '#0f172a', 
    marginBottom: '24px',
    letterSpacing: '-0.025em' 
  },
  topRow: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '24px' 
  },

  leftCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: 'clamp(24px, 5vw, 32px)',
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
    textAlign: 'center',
    gap: '20px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9',
    boxSizing: 'border-box'
  },

  avatarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },

  avatar: {
    height: 'clamp(90px, 15vw, 110px)',
    width: 'clamp(90px, 15vw, 110px)',
    borderRadius: '32px', 
    objectFit: 'cover',
    border: '4px solid #f8fafc',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },

  uploadLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#4f46e5',
    padding: '8px 16px',
    borderRadius: '10px',
    background: '#f5f3ff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    border: '1px solid #ddd6fe'
  },

  name: { 
    fontSize: 'clamp(20px, 4vw, 24px)', 
    fontWeight: '800', 
    color: '#1e293b', 
    margin: '0 0 4px 0',
    lineHeight: '1.2'
  },

  sub: { 
    fontSize: '14px', 
    color: '#64748b', 
    fontWeight: '500' 
  },

  rightCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: 'clamp(24px, 5vw, 32px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9',
    boxSizing: 'border-box'
  },

  fullCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: 'clamp(24px, 5vw, 32px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9',
    marginTop: '24px',
    boxSizing: 'border-box'
  },

  sectionTitle: { 
    fontSize: '11px', 
    fontWeight: '700', 
    color: '#94a3b8', 
    textTransform: 'uppercase', 
    letterSpacing: '0.1em',
    marginBottom: '20px',
    display: 'block'
  },

  label: { 
    fontSize: '12px', 
    color: '#94a3b8', 
    fontWeight: '600',
    marginBottom: '4px',
    display: 'block'
  },

  value: { 
    fontSize: '15px', 
    fontWeight: '600', 
    color: '#334155', 
    marginBottom: '16px',
    display: 'block',
    wordBreak: 'break-all' 
  },

  infoRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    padding: '14px 0',
    borderBottom: '1px solid #f8fafc'
  },

  infoLabel: {
    color: '#64748b',
    fontWeight: '500',
    minWidth: '120px'
  },

  infoValue: {
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'right'
  }
};

export default ProfessorProfile;
