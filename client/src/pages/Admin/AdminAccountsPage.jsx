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
        // Assuming roles are lowercase based on your snippet
        const students = res.data.filter(u => u.role === 'student').length;
        const faculty = res.data.filter(u => u.role === 'professor').length;
        setStats({ students, faculty });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    load();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Account & User Management</h2>
      
      {/* Statistics Section */}
      <div style={styles.topGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Students</p>
          <p style={styles.statValue}>{stats.students.toLocaleString()}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Faculty</p>
          <p style={styles.statValue}>{stats.faculty.toLocaleString()}</p>
        </div>
      </div>

      {/* Navigation Actions Section */}
      <div style={styles.bottomGrid}>
        <div
          style={styles.actionCard}
          onClick={() => navigate('/admin/accounts/upload-students')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={styles.actionTitle}>Upload Students</h3>
          <p style={styles.actionText}>Bulk import student accounts for a specific session.</p>
        </div>

        <div
          style={styles.actionCard}
          onClick={() => navigate('/admin/accounts/upload-faculty')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={styles.actionTitle}>Upload Faculty</h3>
          <p style={styles.actionText}>Import faculty data through Excel files.</p>
        </div>

        <div
          style={styles.actionCard}
          onClick={() => navigate('/admin/accounts/manage')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={styles.actionTitle}>Manage Accounts</h3>
          <p style={styles.actionText}>View lists, filter, and modify accounts.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px', // Better padding for mobile screens
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: { 
    fontSize: 'clamp(20px, 5vw, 24px)', // Fluid typography
    fontWeight: '700', 
    marginBottom: '24px', 
    color: '#111827',
    letterSpacing: '-0.025em'
  },
  topGrid: {
    display: 'grid',
    // On very small screens (under 400px), it will stack. 
    // Otherwise, it sits side-by-side.
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #f3f4f6'
  },
  statLabel: { 
    fontSize: '12px', 
    fontWeight: '600',
    color: '#6b7280', 
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statValue: { 
    fontSize: '28px', 
    fontWeight: '800', 
    marginTop: '4px', 
    color: '#1f2937' 
  },
  bottomGrid: {
    display: 'grid',
    // Larger cards for actions
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px'
  },
  actionCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '120px'
  },
  actionTitle: { 
    fontSize: '16px', 
    fontWeight: '600', 
    marginBottom: '8px', 
    color: '#2563eb' 
  },
  actionText: { 
    fontSize: '14px', 
    color: '#4b5563', 
    lineHeight: '1.5' 
  }
};

export default AdminAccountsPage;