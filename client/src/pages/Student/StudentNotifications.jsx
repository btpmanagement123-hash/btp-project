import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/student/notifications');
        setNotifications(res.data.slice(0, 10));
      } catch (err) {
        console.error('student notifications error', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p style={styles.smallMuted}>Loading notifications...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Notifications</h2>
      <p style={styles.smallMuted}>Stay updated with your project and group activities.</p>

      <div style={styles.cardsCol}>
        {notifications.map((n) => (
          <div key={n._id} style={styles.card}>
            <div style={styles.badgeRow}>
              <span style={styles.statusBadge}>
                {n.type || 'Notice'}
              </span>
              <span style={styles.timestamp}>
                {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>

            <h3 style={styles.cardHeading}>{n.title}</h3>
            <p style={styles.notifMsg}>{n.message}</p>
          </div>
        ))}

        {notifications.length === 0 && (
          <div style={styles.empty}>
            <p>No notifications for now.</p>
          </div>
        )}
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
  card: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: 'clamp(1.25rem, 5vw, 1.75rem)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9',
    width: '100%',
    boxSizing: 'border-box',
    borderLeft: '6px solid #6366f1' 
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '1rem'
  },
  statusBadge: {
    padding: '0.3rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: '#f0f7ff',
    color: '#2563eb',
    border: '1px solid #3b82f633'
  },
  timestamp: {
    fontSize: '0.8125rem',
    color: '#94a3b8',
    fontWeight: '500'
  },
  cardHeading: { 
    fontSize: '1.125rem', 
    fontWeight: '800', 
    marginBottom: '0.5rem', 
    color: '#1e293b',
    lineHeight: '1.4'
  },
  notifMsg: { 
    fontSize: '0.9375rem', 
    color: '#64748b', 
    lineHeight: '1.6',
    margin: 0
  },
  empty: { 
    textAlign: 'center', 
    padding: '3rem', 
    background: '#f8fafc', 
    borderRadius: '1.5rem', 
    color: '#94a3b8', 
    border: '2px dashed #e2e8f0' 
  }
};

export default StudentNotifications;