
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

  
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD || '';
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_PRESET || '';

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/professor/me');
      setProfile(res.data);
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

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={styles.title}>Profile</h2>

      <div style={styles.topRow}>
        <div style={styles.leftCard}>
          <div style={styles.avatarWrapper}>
            <img
              src={
                profile.photoUrl ||
                'https://ui-avatars.com/api/?name=' +
                  encodeURIComponent(profile.name || 'Professor')
              }
              alt="Profile"
              style={styles.avatar}
            />
            <label style={styles.uploadLabel}>
              {uploading ? 'Uploading...' : 'Change Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div>
            <h3 style={styles.name}>{profile.name}</h3>
            <p style={styles.sub}>{profile.designation || 'Assistant Professor'}</p>
            <p style={styles.sub}>{profile.department}</p>
          </div>
        </div>

        <div style={styles.rightCard}>
          <h4 style={styles.sectionTitle}>Contact</h4>
          <p style={styles.label}>Official email</p>
          <p style={styles.value}>{profile.email}</p>

          <p style={styles.label}>Phone</p>
          <p style={styles.value}>{profile.mobile || '-'}</p>

          <p style={styles.label}>Account status</p>
          <p style={{ ...styles.value, color: '#16a34a' }}>
            {profile.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.fullCard}>
          <h4 style={styles.sectionTitle}>Institutional & Academic Information</h4>
          <div style={styles.infoRow}>
            <span style={styles.label}>Employee ID:</span>
            <span style={styles.value}>{profile.staffId || profile.userId}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Department:</span>
            <span style={styles.value}>{profile.department}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Session:</span>
            <span style={styles.value}>{profile.session}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  title: { 
    fontSize: '28px', 
    fontWeight: '800', 
    color: '#0f172a', 
    marginBottom: '24px',
    letterSpacing: '-0.025em' 
  },
  topRow: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    gap: '20px' 
  },
  leftCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column', // Stacked for better mobile/tablet profile
    alignItems: 'center',
    textAlign: 'center',
    gap: '20px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9'
  },
  avatarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    height: '110px',
    width: '110px',
    borderRadius: '30px', // Squircle shape
    objectFit: 'cover',
    border: '4px solid #f8fafc',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  uploadLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6366f1',
    padding: '6px 14px',
    borderRadius: '8px',
    background: '#eef2ff',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  name: { 
    fontSize: '24px', 
    fontWeight: '800', 
    color: '#1e293b', 
    margin: '0 0 4px 0' 
  },
  sub: { 
    fontSize: '14px', 
    color: '#64748b', 
    fontWeight: '500' 
  },
  rightCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9'
  },
  sectionTitle: { 
    fontSize: '13px', 
    fontWeight: '700', 
    color: '#94a3b8', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em',
    marginBottom: '20px' 
  },
  label: { 
    fontSize: '12px', 
    color: '#94a3b8', 
    fontWeight: '600',
    marginBottom: '4px' 
  },
  value: { 
    fontSize: '15px', 
    fontWeight: '600', 
    color: '#334155', 
    marginBottom: '16px' 
  },
  bottomRow: { marginTop: '20px' },
  fullCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    padding: '12px 0',
    borderBottom: '1px solid #f8fafc'
  }
};

export default ProfessorProfile;
