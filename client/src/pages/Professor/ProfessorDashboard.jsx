import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorDashboard = () => {
  const [btpConfig, setBtpConfig] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pubCount, setPubCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, nRes, pRes] = await Promise.all([
          api.get('/professor/btp-config'),
          api.get('/professor/notifications'),
          api.get('/professor/publications')
        ]);
        setBtpConfig(cRes.data);
        setNotifications(nRes.data.slice(0, 3));
        setPubCount(pRes.data.length);
      } catch (err) {
        // optional error handling
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2 style={styles.title}>Notifications</h2>

      <div style={styles.cardsCol}>
        {notifications.map(n => (
          <div key={n._id} style={styles.notificationCard}>
            <h3 style={styles.notifTitle}>{n.title}</h3>
            <p style={styles.notifMsg}>{n.message}</p>
          </div>
        ))}
        {notifications.length === 0 && (
          <p style={styles.empty}>No notifications for now.</p>
        )}
      </div>

      <h3 style={{ ...styles.title, marginTop: 24 }}>BTP Summary</h3>
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Max Members / Group</p>
          <p style={styles.summaryValue}>
            {btpConfig?.maxMembersPerGroup || '-'}
          </p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Max Groups / Supervisor</p>
          <p style={styles.summaryValue}>
            {btpConfig?.maxSupervisorsPerGroup || '-'}
          </p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Registration Deadline</p>
          <p style={styles.summaryValue}>
            {btpConfig?.registrationDeadline
              ? new Date(btpConfig.registrationDeadline).toLocaleDateString()
              : 'Not set'}
          </p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Publications (total)</p>
          <p style={styles.summaryValue}>{pubCount}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Main Heading
  title: { 
    fontSize: 'clamp(20px, 5vw, 24px)', // Responsive text
    fontWeight: '800', 
    color: '#0f172a', 
    marginBottom: '24px',
    letterSpacing: '-0.025em' 
  },

  // Summary Grid (Top stats)
  summaryRow: {
    display: 'grid',
    // Adapts from 1 column on mobile to many on desktop automatically
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
    gap: 'clamp(12px, 3vw, 20px)',
    marginBottom: '32px'
  },

  summaryCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box',
    // Hover effect for interactivity
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
    }
  },

  summaryLabel: { 
    fontSize: '12px', 
    fontWeight: '700', 
    color: '#64748b', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em' 
  },

  summaryValue: { 
    fontSize: 'clamp(24px, 4vw, 32px)', 
    fontWeight: '800', 
    color: '#0f172a', 
    marginTop: '4px',
    fontVariantNumeric: 'tabular-nums'
  },

  // Notifications List
  cardsCol: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px',
    width: '100%'
  },

  notificationCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: 'clamp(16px, 3vw, 20px)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9',
    borderLeft: '4px solid #6366f1', // Indigo accent
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    transition: 'background 0.2s ease'
  },

  notifTitle: { 
    fontSize: '15px', 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: '4px' 
  },

  notifMsg: { 
    fontSize: '14px', 
    color: '#64748b', 
    lineHeight: '1.6',
    wordBreak: 'break-word' // Prevents long text from breaking layout
  },

  empty: { 
    fontSize: '14px', 
    color: '#94a3b8', 
    padding: '40px 20px',
    textAlign: 'center',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '2px dashed #e2e8f0',
    marginTop: '8px'
  }
};

export default ProfessorDashboard;
