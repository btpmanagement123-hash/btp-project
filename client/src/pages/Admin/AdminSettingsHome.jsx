// client/src/pages/Admin/AdminSettingsHome.jsx
import { useNavigate } from 'react-router-dom';

const AdminSettingsHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 style={styles.title}>System Configuration</h2>
      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate('/admin/settings/create-session')}>
          <div style={styles.icon}>📅</div>
          <h3 style={styles.cardTitle}>Create Academic Session</h3>
          <p style={styles.cardText}>
            Define academic year and semester date ranges.
          </p>
        </div>
        <div style={styles.card} onClick={() => navigate('/admin/settings/btp-config')}>
          <div style={styles.icon}>📄</div>
          <h3 style={styles.cardTitle}>BTP Configurations</h3>
          <p style={styles.cardText}>
            Configure group size, supervisors and registration deadline.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  title: { 
    fontSize: 'clamp(20px, 5vw, 24px)', 
    fontWeight: '700', 
    marginBottom: '28px', 
    color: '#0f172a',
    letterSpacing: '-0.02em',
    padding: '0 4px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: 'clamp(16px, 3vw, 24px)',
    width: '100%'
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: 'clamp(20px, 4vw, 30px)', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    cursor: 'pointer',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    height: '100%' 
  },
  icon: { 
    fontSize: '28px', 
    marginBottom: '16px',
    background: '#f8fafc',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    flexShrink: 0 
  },
  cardTitle: { 
    fontSize: '18px', 
    fontWeight: '600', 
    marginBottom: '10px', 
    color: '#1e293b' 
  },
  cardText: { 
    fontSize: '14px', 
    color: '#64748b', 
    lineHeight: '1.6',
    width: '100%' 
  }
};

export default AdminSettingsHome;

