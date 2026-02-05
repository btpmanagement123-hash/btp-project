// import { useEffect, useState } from 'react';
// import api from '../../api/axios';

// const ProfessorDashboard = () => {
//   const [btpConfig, setBtpConfig] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [pubCount, setPubCount] = useState(0);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [cRes, nRes, pRes] = await Promise.all([
//           api.get('/professor/btp-config'),
//           api.get('/professor/notifications'),
//           api.get('/professor/publications')
//         ]);
//         setBtpConfig(cRes.data);
//         setNotifications(nRes.data.slice(0, 3));
//         setPubCount(pRes.data.length);
//       } catch (err) {
//         // optional error handling
//       }
//     };
//     load();
//   }, []);

//   return (
//     <div>
//       <h2 style={styles.title}>Notifications</h2>

//       <div style={styles.cardsCol}>
//         {notifications.map(n => (
//           <div key={n._id} style={styles.notificationCard}>
//             <h3 style={styles.notifTitle}>{n.title}</h3>
//             <p style={styles.notifMsg}>{n.message}</p>
//           </div>
//         ))}
//         {notifications.length === 0 && (
//           <p style={styles.empty}>No notifications for now.</p>
//         )}
//       </div>

//       <h3 style={{ ...styles.title, marginTop: 24 }}>BTP Summary</h3>
//       <div style={styles.summaryRow}>
//         <div style={styles.summaryCard}>
//           <p style={styles.summaryLabel}>Max Members / Group</p>
//           <p style={styles.summaryValue}>
//             {btpConfig?.maxMembersPerGroup || '-'}
//           </p>
//         </div>
//         <div style={styles.summaryCard}>
//           <p style={styles.summaryLabel}>Max Groups / Supervisor</p>
//           <p style={styles.summaryValue}>
//             {btpConfig?.maxSupervisorsPerGroup || '-'}
//           </p>
//         </div>
//         <div style={styles.summaryCard}>
//           <p style={styles.summaryLabel}>Registration Deadline</p>
//           <p style={styles.summaryValue}>
//             {btpConfig?.registrationDeadline
//               ? new Date(btpConfig.registrationDeadline).toLocaleDateString()
//               : 'Not set'}
//           </p>
//         </div>
//         <div style={styles.summaryCard}>
//           <p style={styles.summaryLabel}>Publications (total)</p>
//           <p style={styles.summaryValue}>{pubCount}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   title: { fontSize: 20, fontWeight: 600, marginBottom: 12 },
//   cardsCol: { display: 'flex', flexDirection: 'column', gap: 10 },
//   notificationCard: {
//     background: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
//   },
//   notifTitle: { fontSize: 15, fontWeight: 600, marginBottom: 4 },
//   notifMsg: { fontSize: 13, color: '#6b7280' },
//   empty: { fontSize: 13, color: '#6b7280' },
//   summaryRow: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
//     gap: 14
//   },
//   summaryCard: {
//     background: '#fff',
//     borderRadius: 16,
//     padding: 14,
//     boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
//   },
//   summaryLabel: { fontSize: 12, color: '#6b7280' },
//   summaryValue: { fontSize: 20, fontWeight: 700, marginTop: 4 }
// };

// export default ProfessorDashboard;
import { useEffect, useState } from "react";
import api from "../../api/axios";

const ProfessorDashboard = () => {
  const [btpConfig, setBtpConfig] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pubCount, setPubCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, nRes, pRes] = await Promise.all([
          api.get("/professor/btp-config"),
          api.get("/professor/notifications"),
          api.get("/professor/publications")
        ]);

        setBtpConfig(cRes.data);
        setNotifications(nRes.data.slice(0, 3));
        setPubCount(pRes.data.length);
      } catch {}
    };

    load();
  }, []);

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Notifications</h2>

      <div style={styles.cardsCol}>
        {notifications.map((n) => (
          <div key={n._id} style={styles.notificationCard}>
            <h3 style={styles.notifTitle}>{n.title}</h3>
            <p style={styles.notifMsg}>{n.message}</p>
          </div>
        ))}

        {notifications.length === 0 && (
          <div style={styles.emptyBox}>No notifications available</div>
        )}
      </div>

      <h3 style={{ ...styles.title, marginTop: 24 }}>BTP Summary</h3>

      <div style={styles.summaryGrid}>
        <SummaryCard
          label="Max Members / Group"
          value={btpConfig?.maxMembersPerGroup}
        />

        <SummaryCard
          label="Max Groups / Supervisor"
          value={btpConfig?.maxSupervisorsPerGroup}
        />

        <SummaryCard
          label="Registration Deadline"
          value={
            btpConfig?.registrationDeadline
              ? new Date(
                  btpConfig.registrationDeadline
                ).toLocaleDateString()
              : "Not set"
          }
        />

        <SummaryCard label="Publications" value={pubCount} />
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value }) => (
  <div style={styles.summaryCard}>
    <p style={styles.summaryLabel}>{label}</p>
    <p style={styles.summaryValue}>{value || "-"}</p>
  </div>
);

const styles = {
  wrapper: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 16
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 12
  },

  cardsCol: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  notificationCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.04)"
  },

  notifTitle: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 4
  },

  notifMsg: {
    fontSize: 13,
    color: "#6b7280",
    wordBreak: "break-word"
  },

  emptyBox: {
    background: "#f9fafb",
    padding: 18,
    borderRadius: 14,
    fontSize: 13,
    color: "#6b7280"
  },

  /* ⭐ Responsive Grid */
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: 14
  },

  summaryCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 14,
    boxShadow: "0 6px 20px rgba(0,0,0,0.04)"
  },

  summaryLabel: {
    fontSize: 12,
    color: "#6b7280"
  },

  summaryValue: {
    fontSize: 20,
    fontWeight: 700,
    marginTop: 4
  }
};

export default ProfessorDashboard;
