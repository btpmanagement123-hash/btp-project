// src/pages/Student/StudentNotifications.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/student/notifications');
        setNotifications(res.data.slice(0, 5)); // top 5, chahe to change kar
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
  title: { fontSize: 20, fontWeight: 600, marginBottom: 12 },
  cardsCol: { display: 'flex', flexDirection: 'column', gap: 10 },
  notificationCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
  },
  notifTitle: { fontSize: 15, fontWeight: 600, marginBottom: 4 },
  notifMsg: { fontSize: 13, color: '#6b7280' },
  empty: { fontSize: 13, color: '#6b7280' }
};

export default StudentNotifications;
