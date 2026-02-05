
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentGroupInvitations = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [me, setMe] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const load = async () => {
    try {
      const [meRes, grpRes] = await Promise.all([
        api.get('/student/me'),
        api.get('/student/group-requests')
      ]);

      setMe(meRes.data);
      setGroups(grpRes.data || []);
    } catch (err) {
      console.error('load invitations error', err);
      setError('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (groupId, action) => {
  setActionLoading(groupId + action);
  try {
    await api.post(
      `/student/group-requests/${groupId}/respond`,
      { action } // MUST be "accept" or "reject"
    );
    await load();
  } catch (err) {
    alert(
      err.response?.data?.message ||
        'Failed to submit response'
    );
  } finally {
    setActionLoading('');
  }
};

  if (loading) return <p>Loading invitations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Group Invitations</h2>
      <p style={styles.subtitle}>
        Review BTP group requests you are part of and
        confirm or decline.
      </p>

      {groups.length === 0 && (
        <p style={styles.empty}>
          You have no group invitations.
        </p>
      )}

      {groups.map((g) => {
        const myMember = g.members.find(
          (m) => m.student._id === me._id
        );

        const canRespond =
          myMember &&
          myMember.status === 'pending' &&
          String(g.leader._id) !==
            String(me._id);

        return (
          <div key={g._id} style={styles.card}>
            <div style={styles.header}>
              <h3>{g.title || 'Untitled Project'}</h3>
              <span style={styles.badge}>
                {g.status.replace('_', ' ')}
              </span>
            </div>

            <p style={styles.meta}>
              <b>Leader:</b> {g.leader.name}
            </p>
            <p style={styles.meta}>
              <b>Supervisor:</b>{' '}
              {g.professor.name}
            </p>

            <div style={styles.members}>
              <b>Proposed Members</b>
              {g.members.map((m) => (
                <div
                  key={m.student._id}
                  style={styles.memberRow}
                >
                  <span>
                    {m.student.name} (
                    {m.student.userId})
                  </span>
                  <span
                    style={{
                      ...styles.status,
                      color:
                        m.status ===
                        'accepted'
                          ? '#16a34a'
                          : m.status ===
                            'rejected'
                          ? '#dc2626'
                          : '#ca8a04'
                    }}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>

            {/* 🔥 ACCEPT / REJECT BUTTONS */}
            {canRespond && (
              <div style={styles.actions}>
                <button
                  disabled={
                    actionLoading ===
                    g._id + 'accepted'
                  }
                  onClick={() =>
                    respond(
                      g._id,
                      'accepted'
                    )
                  }
                  style={{
                    ...styles.btn,
                    background: '#22c55e'
                  }}
                >
                  {actionLoading ===
                  g._id + 'accepted'
                    ? 'Accepting...'
                    : 'Accept'}
                </button>

                <button
                  disabled={
                    actionLoading ===
                    g._id + 'rejected'
                  }
                  onClick={() =>
                    respond(
                      g._id,
                      'rejected'
                    )
                  }
                  style={{
                    ...styles.btn,
                    background: '#dc2626'
                  }}
                >
                  {actionLoading ===
                  g._id + 'rejected'
                    ? 'Rejecting...'
                    : 'Reject'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// const styles = {
//   page: {
//     maxWidth: 800,
//     margin: '0 auto',
//     padding: 16
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 700,
//     marginBottom: 4
//   },
//   subtitle: {
//     fontSize: 13,
//     color: '#6b7280',
//     marginBottom: 12
//   },
//   empty: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#6b7280'
//   },
//   card: {
//     background: '#ffffff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 14,
//     boxShadow:
//       '0 10px 30px rgba(15,23,42,0.06)'
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   badge: {
//     background: '#eef2ff',
//     color: '#4338ca',
//     padding: '4px 10px',
//     borderRadius: 999,
//     fontSize: 12,
//     fontWeight: 600
//   },
//   meta: {
//     fontSize: 13,
//     color: '#374151',
//     marginTop: 4
//   },
//   members: {
//     marginTop: 10,
//     fontSize: 13
//   },
//   memberRow: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     padding: '4px 0'
//   },
//   status: {
//     fontWeight: 600,
//     textTransform: 'capitalize'
//   },
//   actions: {
//     display: 'flex',
//     gap: 10,
//     marginTop: 12
//   },
//   btn: {
//     padding: '8px 14px',
//     borderRadius: 999,
//     border: 'none',
//     color: '#fff',
//     cursor: 'pointer',
//     fontWeight: 600
//   }
// };
const styles = {
  page: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "16px"
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 14
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#6b7280"
  },

  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "16px",
    marginBottom: 14,
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
  },

  /* ⭐ RESPONSIVE HEADER */
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6
  },

  badge: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600
  },

  meta: {
    fontSize: 13,
    color: "#374151",
    marginTop: 6
  },

  members: {
    marginTop: 10,
    fontSize: 13
  },

  /* ⭐ MEMBER ROW RESPONSIVE */
  memberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
    padding: "4px 0"
  },

  status: {
    fontWeight: 600,
    textTransform: "capitalize"
  },

  /* ⭐ ACTION BUTTON RESPONSIVE */
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 12,
    flexWrap: "wrap"
  },

  btn: {
    padding: "8px 14px",
    borderRadius: 999,
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    flex: "1 1 120px"
  }
};


export default StudentGroupInvitations;
