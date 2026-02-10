import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorDashboard = () => {
  const [btpConfig, setBtpConfig] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pubCount, setPubCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
        console.error('dashboard load error', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Recent';
    const date = new Date(dateStr);
    const d = date.toLocaleDateString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });
    const t = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
    return `${d} • ${t}`;
  };

  if (loading) return <p style={styles.smallMuted}>Loading dashboard...</p>;

  return (
    <div style={styles.container}>
      {/* Notifications Section */}
      <h2 style={styles.title}>Recent Notifications</h2>
      <p style={styles.smallMuted}>Stay updated with student requests and system alerts.</p>
      
      <div style={styles.cardsCol}>
        {notifications.map(n => (
          <div key={n._id} style={styles.notifCard}>
            <h3 style={styles.cardHeadingSmall}>{n.title}</h3>
            <p style={styles.notifMsg}>{n.message}</p>
            <div style={styles.timestampContainer}>
              <span style={styles.timestampText}>
                {formatTimestamp(n.createdAt)}
              </span>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div style={styles.empty}>No new notifications.</div>
        )}
      </div>

      {/* BTP Summary Section */}
      <h2 style={{ ...styles.title, marginTop: '3rem' }}>BTP Summary</h2>
      <p style={styles.smallMuted}>Overview of current project configurations and output.</p>
      
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p style={styles.sectionTitle}>Group Policy</p>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Max Members</span>
            <span style={styles.metaValue}>{btpConfig?.maxMembersPerGroup || '-'}</span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Max Groups</span>
            <span style={styles.metaValue}>{btpConfig?.maxSupervisorsPerGroup || '-'}</span>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <p style={styles.sectionTitle}>Timeline & Research</p>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Deadline</span>
            <span style={styles.metaValue}>
              {btpConfig?.registrationDeadline
                ? new Date(btpConfig.registrationDeadline).toLocaleDateString()
                : 'Not set'}
            </span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Total Publications</span>
            <span style={styles.metaValue}>{pubCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    width: '100%', 
    maxWidth: '100%' 
  },
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
    marginBottom: '1.5rem',
    display: 'block'
  },
  cardsCol: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem', 
    width: '100%'
  },
  notifCard: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: 'clamp(1.25rem, 5vw, 1.75rem)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9',
    borderLeft: '6px solid #6366f1',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeadingSmall: { 
    fontSize: '1.125rem', 
    fontWeight: '800', 
    marginBottom: '0.375rem', 
    color: '#1e293b' 
  },
  notifMsg: { 
    fontSize: '0.9375rem', 
    color: '#64748b', 
    lineHeight: '1.6',
    margin: 0
  },
  timestampContainer: {
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center'
  },
  timestampText: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
    gap: '1.5rem'
  },
  summaryCard: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9'
  },
  sectionTitle: { 
    fontSize: '0.8125rem', 
    fontWeight: '700', 
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.875rem 0',
    borderBottom: '1px solid #f8fafc',
    fontSize: '0.9375rem'
  },
  metaLabel: { color: '#64748b', fontWeight: '500' },
  metaValue: { color: '#334155', fontWeight: '800', fontSize: '1.125rem' },
  empty: { 
    textAlign: 'center', 
    padding: '3rem', 
    background: '#f8fafc', 
    borderRadius: '1.5rem', 
    color: '#94a3b8', 
    border: '2px dashed #e2e8f0' 
  }
};

export default ProfessorDashboard;