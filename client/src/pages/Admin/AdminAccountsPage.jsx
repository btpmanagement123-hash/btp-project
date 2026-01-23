// src/pages/Admin/AdminAccountsPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AdminAccountsPage = () => {
  const [stats, setStats] = useState({ students: 0, faculty: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/users');
        const students = res.data.filter(u => u.role === 'student').length;
        const faculty = res.data.filter(u => u.role === 'professor').length;
        setStats({ students, faculty });
      } catch (err) {}
    };
    load();
  }, []);

  return (
    <div>
      <h2 style={styles.title}>Account & User Management</h2>
      <div style={styles.topGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Students</p>
          <p style={styles.statValue}>{stats.students}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Faculty</p>
          <p style={styles.statValue}>{stats.faculty}</p>
        </div>
      </div>

      <div style={styles.bottomGrid}>
        <div
          style={styles.actionCard}
          onClick={() => navigate('/admin/accounts/upload-students')}
        >
          <h3 style={styles.actionTitle}>Upload Students</h3>
          <p style={styles.actionText}>Bulk import student accounts for a specific session.</p>
        </div>
        <div
          style={styles.actionCard}
          onClick={() => navigate('/admin/accounts/upload-faculty')}
        >
          <h3 style={styles.actionTitle}>Upload Faculty</h3>
          <p style={styles.actionText}>Import faculty data through Excel files.</p>
        </div>
        <div
          style={styles.actionCard}
          onClick={() => navigate('/admin/accounts/manage')}
        >
          <h3 style={styles.actionTitle}>Manage Accounts</h3>
          <p style={styles.actionText}>View lists, filter, and modify accounts.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  title: { fontSize: 22, fontWeight: 600, marginBottom: 18 },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
    gap: 16,
    marginBottom: 24
  },
  statCard: {
    background: '#ffffff',
    borderRadius: 18,
    padding: '18px 20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
  },
  statLabel: { fontSize: 13, color: '#6b7280' },
  statValue: { fontSize: 28, fontWeight: 700, marginTop: 6 },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
    gap: 16
  },
  actionCard: {
    background: '#ffffff',
    borderRadius: 18,
    padding: '18px 20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    cursor: 'pointer'
  },
  actionTitle: { fontSize: 15, fontWeight: 600, marginBottom: 4 },
  actionText: { fontSize: 13, color: '#6b7280' }
};

export default AdminAccountsPage;
