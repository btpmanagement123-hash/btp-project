// import { useEffect, useState } from 'react';
// import api from '../../api/axios';

// const StudentProjectOverview = () => {
//   const [group, setGroup] = useState(null);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Simple version: show latest group-request as status
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await api.get('/student/group-requests');
//         const list = res.data || [];
//         setRequests(list);
//         const approved = list.find((r) => r.status === 'approved');
//         if (approved) {
//           setGroup(approved);
//         }
//       } catch (err) {
//         console.error('student group-requests error', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   if (!group && requests.length === 0) {
//     return (
//       <p style={{ fontSize: 14, color: '#6b7280' }}>
//         No project registered yet. Create a group from the Registration page.
//       </p>
//     );
//   }

//   const latest = requests[0];

//   return (
//     <div>
//       <h2 style={styles.title}>Project Overview</h2>

//       {latest && (
//         <div style={styles.badgeRow}>
//           <span style={styles.statusBadge(latest.status)}>
//             {latest.status.replace('_', ' ')}
//           </span>
//           <span style={styles.smallMuted}>
//             Supervisor: {latest.professor?.name || 'TBD'}
//           </span>
//         </div>
//       )}

//       {group && (
//         <div style={styles.card}>
//           <h3 style={styles.cardHeading}>{group.title || 'BTP Project'}</h3>
//           <div style={styles.metaRow}>
//             <span style={styles.metaLabel}>Supervisor</span>
//             <span style={styles.metaValue}>
//               {group.professor?.name || 'Not assigned'}
//             </span>
//           </div>
//           <div style={styles.metaRow}>
//             <span style={styles.metaLabel}>Session</span>
//             <span style={styles.metaValue}>{group.session}</span>
//           </div>

//           <h4 style={styles.teamTitle}>Student Team</h4>
//           <div style={styles.teamList}>
//             {group.members.map((m) => (
//               <div key={m.student?._id || m._id} style={styles.teamChip}>
//                 <span style={styles.initial}>
//                   {(m.student?.name || m.studentName || '?')[0]}
//                 </span>
//                 <div>
//                   <div style={styles.chipName}>
//                     {m.student?.name || m.studentName || 'Student'}
//                   </div>
//                   <div style={styles.chipRoll}>
//                     {m.student?.userId || m.rollNo || ''}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   title: { fontSize: 22, fontWeight: 700, marginBottom: 10 },
//   badgeRow: {
//     display: 'flex',
//     gap: 10,
//     alignItems: 'center',
//     marginBottom: 16
//   },
//   statusBadge: (status) => ({
//     padding: '4px 10px',
//     borderRadius: 999,
//     fontSize: 12,
//     fontWeight: 600,
//     textTransform: 'capitalize',
//     background:
//       status === 'approved'
//         ? '#dcfce7'
//         : status === 'rejected'
//         ? '#fee2e2'
//         : '#e0f2fe',
//     color:
//       status === 'approved'
//         ? '#15803d'
//         : status === 'rejected'
//         ? '#b91c1c'
//         : '#0369a1'
//   }),
//   smallMuted: { fontSize: 12, color: '#6b7280' },
//   card: {
//     background: '#ffffff',
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
//   },
//   cardHeading: { fontSize: 20, fontWeight: 700, marginBottom: 12 },
//   metaRow: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     fontSize: 13,
//     padding: '4px 0'
//   },
//   metaLabel: { color: '#6b7280' },
//   metaValue: { color: '#111827', fontWeight: 500 },
//   teamTitle: { marginTop: 16, fontSize: 14, fontWeight: 600 },
//   teamList: { marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 },
//   teamChip: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 8,
//     padding: 8,
//     borderRadius: 12,
//     background: '#f9fafb'
//   },
//   initial: {
//     width: 28,
//     height: 28,
//     borderRadius: '999px',
//     background: '#e5e7eb',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: 13,
//     fontWeight: 600
//   },
//   chipName: { fontSize: 13, fontWeight: 500 },
//   chipRoll: { fontSize: 11, color: '#6b7280' }
// };

// export default StudentProjectOverview;
import { useEffect, useState } from "react";
import api from "../../api/axios";

const StudentProjectOverview = () => {
  const [group, setGroup] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/student/group-requests");
        const list = res.data || [];

        setRequests(list);

        const approved = list.find((r) => r.status === "approved");
        if (approved) setGroup(approved);
      } catch (err) {
        console.error("student group-requests error", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p style={styles.loading}>Loading...</p>;

  if (!group && requests.length === 0) {
    return (
      <div style={styles.emptyBox}>
        No project registered yet. Create group from Registration.
      </div>
    );
  }

  const latest = requests[0];

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Project Overview</h2>

      {/* Status */}
      {latest && (
        <div style={styles.badgeRow}>
          <span style={styles.statusBadge(latest.status)}>
            {latest.status.replace("_", " ")}
          </span>

          <span style={styles.smallMuted}>
            Supervisor: {latest.professor?.name || "TBD"}
          </span>
        </div>
      )}

      {/* Project Card */}
      {group && (
        <div style={styles.card}>
          <h3 style={styles.cardHeading}>
            {group.title || "BTP Project"}
          </h3>

          <InfoRow
            label="Supervisor"
            value={group.professor?.name || "Not assigned"}
          />

          <InfoRow label="Session" value={group.session} />

          {/* Team */}
          <h4 style={styles.teamTitle}>Student Team</h4>

          <div style={styles.teamGrid}>
            {group.members.map((m) => (
              <div key={m.student?._id || m._id} style={styles.teamChip}>
                <span style={styles.initial}>
                  {(m.student?.name || "?")[0]}
                </span>

                <div>
                  <div style={styles.chipName}>
                    {m.student?.name || "Student"}
                  </div>
                  <div style={styles.chipRoll}>
                    {m.student?.userId || ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* Reusable row */
const InfoRow = ({ label, value }) => (
  <div style={styles.metaRow}>
    <span style={styles.metaLabel}>{label}</span>
    <span style={styles.metaValue}>{value}</span>
  </div>
);

const styles = {
  wrapper: {
    maxWidth: 850,
    margin: "0 auto",
    padding: 16
  },

  loading: {
    textAlign: "center",
    padding: 20
  },

  emptyBox: {
    background: "#f9fafb",
    padding: 18,
    borderRadius: 14,
    fontSize: 14,
    color: "#6b7280"
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12
  },

  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    marginBottom: 16
  },

  statusBadge: (status) => ({
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "capitalize",
    background:
      status === "approved"
        ? "#dcfce7"
        : status === "rejected"
        ? "#fee2e2"
        : "#e0f2fe",
    color:
      status === "approved"
        ? "#15803d"
        : status === "rejected"
        ? "#b91c1c"
        : "#0369a1"
  }),

  smallMuted: {
    fontSize: 12,
    color: "#6b7280"
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
  },

  cardHeading: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12
  },

  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    fontSize: 13,
    padding: "6px 0"
  },

  metaLabel: {
    color: "#6b7280"
  },

  metaValue: {
    color: "#111827",
    fontWeight: 500
  },

  teamTitle: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: 600
  },

  /* ⭐ Responsive Team Grid */
  teamGrid: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: 10
  },

  teamChip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    background: "#f9fafb"
  },

  initial: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600
  },

  chipName: {
    fontSize: 13,
    fontWeight: 500
  },

  chipRoll: {
    fontSize: 11,
    color: "#6b7280"
  }
};

export default StudentProjectOverview;
