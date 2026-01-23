// client/src/pages/Professor/ProfessorProfile.jsx
// client/src/pages/Professor/ProfessorProfile.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // env vars (CRA pattern) – .env me set kar:
  // REACT_APP_CLOUDINARY_CLOUD=your_cloud
  // REACT_APP_CLOUDINARY_PRESET=your_preset
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
  title: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
  topRow: { display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: 16 },
  leftCard: {
    background: '#fff',
    borderRadius: 18,
    padding: 18,
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.04)'
  },
  avatarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: '999px',
    objectFit: 'cover',
    border: '3px solid #e5e7eb'
  },
  uploadLabel: {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    border: '1px solid #e5e7eb',
    cursor: 'pointer'
  },
  name: { fontSize: 24, fontWeight: 700 },
  sub: { fontSize: 13, color: '#6b7280' },
  rightCard: {
    background: '#fff',
    borderRadius: 18,
    padding: 18,
    boxShadow: '0 10px 25px rgba(0,0,0,0.04)'
  },
  sectionTitle: { fontSize: 14, fontWeight: 600, marginBottom: 10 },
  label: { fontSize: 12, color: '#6b7280' },
  value: { fontSize: 13, fontWeight: 500, marginBottom: 6 },
  bottomRow: { marginTop: 16 },
  fullCard: {
    background: '#fff',
    borderRadius: 18,
    padding: 18,
    boxShadow: '0 10px 25px rgba(0,0,0,0.04)'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    padding: '6px 0',
    borderBottom: '1px dashed #e5e7eb'
  }
};

export default ProfessorProfile;
