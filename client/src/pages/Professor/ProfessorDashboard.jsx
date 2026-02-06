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
  title: { 
    fontSize: '24px', 
    fontWeight: '800', 
    color: '#0f172a', 
    marginBottom: '16px',
    letterSpacing: '-0.025em' 
  },
  cardsCol: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px' 
  },
  notificationCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '16px 20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid #6366f1', // Indigo accent
    border: '1px solid #f1f5f9',
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
    lineHeight: '1.5' 
  },
  empty: { 
    fontSize: '14px', 
    color: '#94a3b8', 
    fontStyle: 'italic',
    padding: '12px'
  },
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Responsive grid
    gap: '20px'
  },
  summaryCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'transform 0.2s ease'
  },
  summaryLabel: { 
    fontSize: '13px', 
    fontWeight: '600', 
    color: '#94a3b8', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em' 
  },
  summaryValue: { 
    fontSize: '28px', 
    fontWeight: '800', 
    color: '#0f172a', 
    marginTop: '8px',
    fontVariantNumeric: 'tabular-nums' // Keeps numbers aligned
  }
};
export default ProfessorDashboard;
