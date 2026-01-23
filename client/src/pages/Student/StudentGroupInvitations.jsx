import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentGroupInvitations = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const res = await api.get('/student/group-requests');
      setRequests(res.data || []);
    } catch (err) {
      console.error('group-requests error', err);
      setError('Could not load group invitations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const myStatus = (req, myId) => {
    const m = req.members.find(
      (x) => String(x.student?._id) === String(myId)
    );
    return m?.status || 'pending';
  };

  const handleRespond = async (id, action) => {
    setActionId(id);
    try {
      await api.post(`/student/group-requests/${id}/respond`, { action });
      await load();
    } catch (err) {
      console.error('respond error', err);
      setError(
        err.response?.data?.message || 'Could not update response.'
      );
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error && !requests.length) return <p>{error}</p>;

  return (
    <div>
      <h2 style={styles.title}>Group Invitations</h2>
      <p style={styles.subtitle}>
        Review BTP group requests you are part of and confirm or decline.
      </p>

      {requests.length === 0 && (
        <p style={styles.muted}>No active group requests currently.</p>
      )}

      <div style={styles.list}>
        {requests.map((r) => {
          const status = r.status; // overall status
          const myId = r.members[0]?.student?._id; // backend se req.user._id bhi bhej sakte ho; simple ke liye yeh chhodo
          // NOTE: realistically myId context se aayega; yahan UI focus hai

          return (
            <div key={r._id} style={styles.card}>
              <div style={{ flex: 1 }}>
                <div style={styles.headerRow}>
                  <h3 style={styles.reqTitle}>
                    {r.title || 'BTP Project'}
                  </h3>
                  <span style={styles.statusBadge(status)}>
                    {status.replace('_', ' ')}
                  </span>
                </div>
                <p style={styles.meta}>
                  Leader: {r.leader?.name} ({r.leader?.userId})
                </p>
                <p style={styles.metaSmall}>
                  Supervisor: {r.professor?.name || 'TBD'}
                </p>

                <h4 style={styles.teamTitle}>Proposed Members</h4>
                <div style={styles.teamList}>
                  {r.members.map((m) => (
                    <div key={m.student?._id} style={styles.teamChip}>
                      <span style={styles.initial}>
                        {(m.student?.name || '?')[0]}
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

              <div style={styles.actionsCol}>
                {status === 'pending_students' && (
                  <>
                    <button
                      disabled={actionId === r._id}
                      onClick={() => handleRespond(r._id, 'accept')}
                      style={styles.acceptBtn}
                    >
                      {actionId === r._id ? 'Saving...' : 'Accept'}
                    </button>
                    <button
                      disabled={actionId === r._id}
                      onClick={() => handleRespond(r._id, 'reject')}
                      style={styles.rejectBtn}
                    >
                      Reject
                    </button>
                  </>
                )}
                {status === 'rejected' && (
                  <p style={styles.rejectedText}>
                    This group request was rejected. Create a new group
                    from the Registration page.
                  </p>
                )}
                {status === 'pending_professor' && (
                  <p style={styles.muted}>
                    All members accepted. Waiting for supervisor approval.
                  </p>
                )}
                {status === 'approved' && (
                  <p style={styles.muted}>
                    Group approved. See details in Project Overview.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 16 },
  muted: { fontSize: 13, color: '#6b7280' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: {
    display: 'flex',
    gap: 14,
    background: '#ffffff',
    borderRadius: 18,
    padding: 16,
    boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  reqTitle: { fontSize: 16, fontWeight: 600 },
  statusBadge: (st) => ({
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 11,
    textTransform: 'capitalize',
    background:
      st === 'approved'
        ? '#dcfce7'
        : st === 'rejected'
        ? '#fee2e2'
        : '#e0f2fe',
    color:
      st === 'approved'
        ? '#15803d'
        : st === 'rejected'
        ? '#b91c1c'
        : '#0369a1',
    fontWeight: 600
  }),
  meta: { fontSize: 13, color: '#4b5563' },
  metaSmall: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  teamTitle: { fontSize: 13, fontWeight: 600, marginTop: 6 },
  teamList: {
    marginTop: 6,
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  teamChip: {
    display: 'flex',
    gap: 8,
    padding: 6,
    borderRadius: 12,
    background: '#f9fafb'
  },
  initial: {
    width: 26,
    height: 26,
    borderRadius: '999px',
    background: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600
  },
  memberName: { fontSize: 13, fontWeight: 500 },
  memberRoll: { fontSize: 11, color: '#6b7280' },
  memberStatus: (st) => ({
    fontSize: 11,
    marginTop: 2,
    color:
      st === 'accepted'
        ? '#16a34a'
        : st === 'rejected'
        ? '#b91c1c'
        : '#6b7280'
  }),
  actionsCol: {
    minWidth: 140,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 6
  },
  acceptBtn: {
    padding: '8px 0',
    borderRadius: 999,
    border: 'none',
    background: '#22c55e',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  },
  rejectBtn: {
    padding: '8px 0',
    borderRadius: 999,
    border: 'none',
    background: '#fee2e2',
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  },
  rejectedText: { fontSize: 12, color: '#b91c1c' }
};

export default StudentGroupInvitations;
