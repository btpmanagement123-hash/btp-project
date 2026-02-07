// src/pages/Student/StudentNotifications.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/student/notifications');
        setNotifications(res.data.slice(0, 10)); // top 5, chahe to change kar
      } catch (err) {
        // optional error handling
        console.error('student notifications error', err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2 style={styles.title}>Notifications</h2>

      <div style={styles.cardsCol}>
        {notifications.map((n) => (
          <div key={n._id} style={styles.notificationCard}>
            <h3 style={styles.notifTitle}>{n.title}</h3>
            <p style={styles.notifMsg}>{n.message}</p>
          </div>
        ))}

        {notifications.length === 0 && (
          <p style={styles.empty}>No notifications for now.</p>
        )}
      </div>
    </div>
  );
};

const styles = {

  container: {
    padding: '1rem',
    maxWidth: '800px',
    width: '100%',
    boxSizing: 'border-box'
  },

  title: { 
    fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', 
    fontWeight: '800', 
    marginBottom: '1.25rem', 
    color: '#0f172a',
    letterSpacing: '-0.025em',
    textAlign: 'left'
  },

  cardsCol: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.75rem', 
    width: '100%'
  },

  notificationCard: {
    background: '#ffffff',
    borderRadius: '12px', 
    padding: '1rem 1.25rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9',
    borderLeft: '4px solid #6366f1',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  },

  notifTitle: { 
    fontSize: '0.9375rem', // 15px
    fontWeight: '700', 
    marginBottom: '0.375rem', 
    color: '#1e293b',
    wordBreak: 'break-word' 
  },

  notifMsg: { 
    fontSize: '0.875rem', // 14px
    color: '#64748b', 
    lineHeight: '1.5',
    overflowWrap: 'anywhere'
  },

  empty: { 
    textAlign: 'center',
    padding: '2.5rem 1.25rem',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '2px dashed #e2e8f0',
    color: '#94a3b8',
    fontSize: '0.875rem',
    width: '100%',
    boxSizing: 'border-box'
  }
};
export default StudentNotifications;
