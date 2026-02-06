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
  title: { 
    fontSize: '24px', 
    fontWeight: '800', 
    marginBottom: '20px', 
    color: '#0f172a',
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
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    borderLeft: '4px solid #6366f1', // Indigo accent bar
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default'
  },
  notifTitle: { 
    fontSize: '15px', 
    fontWeight: '700', 
    marginBottom: '6px', 
    color: '#1e293b' 
  },
  notifMsg: { 
    fontSize: '14px', 
    color: '#64748b', 
    lineHeight: '1.5' 
  },
  empty: { 
    textAlign: 'center',
    padding: '40px 20px',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '2px dashed #e2e8f0',
    color: '#94a3b8',
    fontSize: '14px'
  }
};
export default StudentNotifications;
