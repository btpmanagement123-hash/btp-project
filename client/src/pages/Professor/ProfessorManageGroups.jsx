
// import { useEffect, useState } from 'react';
// import api from '../../api/axios';

// const ProfessorManageGroups = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionId, setActionId] = useState(null);

//   const load = async () => {
//     try {
//       const res = await api.get('/professor/group-requests');
//       setRequests(res.data || []);
//     } catch (err) {
//       console.error('professor group-requests error', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const handleDecision = async (id, action) => {
//     setActionId(id);
//     try {
//       await api.post(`/professor/group-requests/${id}/decide`, { action });
//       await load();
//     } catch (err) {
//       console.error('decide group request error', err);
//     } finally {
//       setActionId(null);
//     }
//   };

//   return (
//     <div>
//       <h2 style={styles.title}>Manage Group Requests</h2>
//       <p style={styles.subtitle}>
//         Review incoming group registration requests and approve or reject them.
//       </p>

//       {loading && <p style={styles.muted}>Loading...</p>}

//       {!loading && requests.length === 0 && (
//         <p style={styles.muted}>No pending requests right now.</p>
//       )}

//       <div style={styles.list}>
//         {requests.map((r) => (
//           <div key={r._id} style={styles.card}>
//             <div style={{ flex: 1 }}>
//               <div style={styles.headerRow}>
//                 <h3 style={styles.reqTitle}>{r.title || 'BTP Project'}</h3>
//                 <span style={styles.badge}>New</span>
//               </div>
//               <p style={styles.metaLine}>
//                 Leader: {r.leader?.name} ({r.leader?.userId})
//               </p>
//               <p style={styles.metaLine}>Session: {r.session}</p>

//               <h4 style={styles.teamTitle}>Proposed Team</h4>
//               <div style={styles.teamList}>
//                 {r.members.map((m) => (
//                   <div key={m.student?._id} style={styles.teamChip}>
//                     <span style={styles.initial}>
//                       {(m.student?.name || '?')[0]}
//                     </span>
//                     <div>
//                       <div style={styles.memberName}>{m.student?.name}</div>
//                       <div style={styles.memberRoll}>{m.student?.userId}</div>
//                       <div style={styles.memberStatus(m.status)}>
//                         {m.status}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div style={styles.actionsCol}>
//               <button
//                 disabled={actionId === r._id}
//                 onClick={() => handleDecision(r._id, 'approve')}
//                 style={styles.approveBtn}
//               >
//                 {actionId === r._id ? 'Approving...' : 'Approve'}
//               </button>
//               <button
//                 disabled={actionId === r._id}
//                 onClick={() => handleDecision(r._id, 'reject')}
//                 style={styles.rejectBtn}
//               >
//                 {actionId === r._id ? 'Rejecting...' : 'Reject'}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
//   subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 16 },
//   muted: { fontSize: 13, color: '#6b7280' },
//   list: { display: 'flex', flexDirection: 'column', gap: 12 },
//   card: {
//     display: 'flex',
//     gap: 16,
//     background: '#ffffff',
//     borderRadius: 18,
//     padding: 16,
//     boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
//   },
//   headerRow: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6
//   },
//   reqTitle: { fontSize: 16, fontWeight: 600 },
//   badge: {
//     padding: '2px 8px',
//     borderRadius: 999,
//     fontSize: 11,
//     background: '#eef2ff',
//     color: '#4f46e5',
//     fontWeight: 600
//   },
//   metaLine: { fontSize: 12, color: '#6b7280' },
//   teamTitle: { marginTop: 10, fontSize: 13, fontWeight: 600 },
//   teamList: {
//     marginTop: 6,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 6
//   },
//   teamChip: {
//     display: 'flex',
//     gap: 8,
//     padding: 6,
//     borderRadius: 12,
//     background: '#f9fafb'
//   },
//   initial: {
//     width: 26,
//     height: 26,
//     borderRadius: '999px',
//     background: '#e5e7eb',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: 12,
//     fontWeight: 600
//   },
//   memberName: { fontSize: 13, fontWeight: 500 },
//   memberRoll: { fontSize: 11, color: '#6b7280' },
//   memberStatus: (status) => ({
//     fontSize: 11,
//     marginTop: 2,
//     color:
//       status === 'accepted'
//         ? '#16a34a'
//         : status === 'rejected'
//         ? '#b91c1c'
//         : '#6b7280'
//   }),
//   actionsCol: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 6,
//     minWidth: 130,
//     justifyContent: 'center'
//   },
//   approveBtn: {
//     padding: '8px 0',
//     borderRadius: 999,
//     border: 'none',
//     background: '#22c55e',
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: 'pointer'
//   },
//   rejectBtn: {
//     padding: '8px 0',
//     borderRadius: 999,
//     border: 'none',
//     background: '#fee2e2',
//     color: '#b91c1c',
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: 'pointer'
//   }
// };

// export default ProfessorManageGroups;
import { useEffect, useState } from "react";
import api from "../../api/axios";

const ProfessorManageGroups = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/professor/group-requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDecision = async (id, action) => {
    setActionId(id);
    try {
      await api.post(`/professor/group-requests/${id}/decide`, { action });
      await load();
    } catch {}
    setActionId(null);
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Manage Group Requests</h2>

      <p style={styles.subtitle}>
        Review incoming group registration requests.
      </p>

      {loading && <p style={styles.muted}>Loading...</p>}

      {!loading && requests.length === 0 && (
        <p style={styles.muted}>No pending requests.</p>
      )}

      <div style={styles.list}>
        {requests.map((r) => (
          <div key={r._id} style={styles.card}>
            {/* Project Info */}
            <div>
              <div style={styles.headerRow}>
                <h3 style={styles.reqTitle}>
                  {r.title || "BTP Project"}
                </h3>
                <span style={styles.badge}>New</span>
              </div>

              <p style={styles.metaLine}>
                Leader: {r.leader?.name} ({r.leader?.userId})
              </p>

              <p style={styles.metaLine}>Session: {r.session}</p>

              <h4 style={styles.teamTitle}>Proposed Team</h4>

              <div style={styles.teamGrid}>
                {r.members.map((m) => (
                  <div key={m.student?._id} style={styles.teamChip}>
                    <span style={styles.initial}>
                      {(m.student?.name || "?")[0]}
                    </span>

                    <div>
                      <div style={styles.memberName}>
                        {m.student?.name}
                      </div>

                      <div style={styles.memberRoll}>
                        {m.student?.userId}
                      </div>

                      <div style={styles.memberStatus(m.status)}>
                        {m.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div style={styles.actionsRow}>
              <button
                disabled={actionId === r._id}
                onClick={() => handleDecision(r._id, "approve")}
                style={styles.approveBtn}
              >
                {actionId === r._id ? "Approving..." : "Approve"}
              </button>

              <button
                disabled={actionId === r._id}
                onClick={() => handleDecision(r._id, "reject")}
                style={styles.rejectBtn}
              >
                {actionId === r._id ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 16
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16
  },

  muted: {
    fontSize: 13,
    color: "#6b7280"
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  /* ⭐ Responsive Card */
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    background: "#fff",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
  },

  headerRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 6
  },

  reqTitle: {
    fontSize: 16,
    fontWeight: 600
  },

  badge: {
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    background: "#eef2ff",
    color: "#4f46e5",
    fontWeight: 600
  },

  metaLine: {
    fontSize: 12,
    color: "#6b7280"
  },

  teamTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: 600
  },

  /* ⭐ Responsive Members */
  teamGrid: {
    marginTop: 6,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: 8
  },

  teamChip: {
    display: "flex",
    gap: 8,
    padding: 8,
    borderRadius: 12,
    background: "#f9fafb"
  },

  initial: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600
  },

  memberName: { fontSize: 13, fontWeight: 500 },
  memberRoll: { fontSize: 11, color: "#6b7280" },

  memberStatus: (status) => ({
    fontSize: 11,
    marginTop: 2,
    color:
      status === "accepted"
        ? "#16a34a"
        : status === "rejected"
        ? "#b91c1c"
        : "#6b7280"
  }),

  /* ⭐ Buttons Mobile Safe */
  actionsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8
  },

  approveBtn: {
    flex: 1,
    padding: "8px 0",
    borderRadius: 999,
    border: "none",
    background: "#22c55e",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer"
  },

  rejectBtn: {
    flex: 1,
    padding: "8px 0",
    borderRadius: 999,
    border: "none",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: 600,
    cursor: "pointer"
  }
};

export default ProfessorManageGroups;
