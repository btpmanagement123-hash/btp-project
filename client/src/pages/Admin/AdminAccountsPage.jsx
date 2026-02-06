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
  title: { 
    fontSize: '24px', 
    fontWeight: '700', 
    marginBottom: '24px', 
    color: '#111827',
    letterSpacing: '-0.025em'
  },
  topGrid: {
    display: 'grid',
    // Responsive grid: 1 column on small screens, 2 on larger
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    border: '1px solid #f3f4f6'
  },
  statLabel: { 
    fontSize: '14px', 
    fontWeight: '500',
    color: '#6b7280', 
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  statValue: { 
    fontSize: '32px', 
    fontWeight: '800', 
    marginTop: '8px', 
    color: '#1f2937' 
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  actionCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    border: '1px solid #f3f4f6',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  actionTitle: { 
    fontSize: '16px', 
    fontWeight: '600', 
    marginBottom: '8px', 
    color: '#3b82f6' 
  },
  actionText: { 
    fontSize: '14px', 
    color: '#4b5563', 
    lineHeight: '1.5' 
  }
};

export default AdminAccountsPage;
