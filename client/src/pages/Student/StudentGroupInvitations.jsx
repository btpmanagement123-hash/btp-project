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
      setError('');
    } catch (err) {
      setError('Failed to load invitations. Please try again later.');
      console.error('Load invitations error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (groupId, action) => {
    const actionText = action === 'accept' ? 'accept' : 'decline';
    
    if (action === 'reject' && !window.confirm('Are you sure you want to decline?')) {
      return;
    }

    setActionLoading(groupId + action);
    try {
      await api.post(`/student/group-requests/${groupId}/respond`, { action });
      await load();
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Failed to ${actionText} invitation`;
      alert(errorMsg);
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.smallMuted}>Loading invitations...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={styles.errorBox}>
        <p>{error}</p>
        <button onClick={load} style={styles.retryBtn}>Retry</button>
      </div>
    );
  }

  const userIdStr = String(me?._id);

  // Groups where you are listed as "pending"
  const myInvitations = groups.filter((g) => {
    const myMember = g.members?.find(m => String(m.student?._id) === userIdStr);
    return myMember && myMember.status === 'pending';
  });

  // Groups where you have already accepted/joined
  const myJoinedGroups = groups.filter((g) => {
    const myMember = g.members?.find(m => String(m.student?._id) === userIdStr);
    return myMember && myMember.status === 'accepted';
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Group Invitations</h2>
      <p style={styles.smallMuted}>
        Manage your project group invitations and track registration status.
      </p>

      {/* Pending Invitations */}
      {myInvitations.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📩 Pending Invitations ({myInvitations.length})</h3>
          {myInvitations.map((g) => (
            <div key={g._id} style={styles.card}>
              <div style={styles.badgeRow}>
                <span style={styles.statusBadge(g.status)}>{g.status.replace('_', ' ')}</span>
                <span style={styles.supervisorText}>
                  Supervisor: <b style={{ color: '#1e293b' }}>{g.professor?.name || 'TBD'}</b>
                </span>
              </div>

              <h3 style={styles.cardHeading}>{g.title || 'Untitled Project'}</h3>
              
              <h4 style={styles.teamTitle}>Team Members ({g.members.length})</h4>
              <div style={styles.teamList}>
                {g.members.map((m) => (
                  <div key={m.student._id} style={styles.teamChip}>
                    <span style={styles.initial}>{m.student.name.charAt(0)}</span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={styles.chipName}>
                        {m.student.name} {String(m.student._id) === userIdStr && '(You)'}
                      </div>
                      <div style={styles.chipRoll}>{m.student.userId}</div>
                      <div style={styles.statusText(m.status)}>{m.status}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.actions}>
                <button
                  disabled={!!actionLoading}
                  onClick={() => respond(g._id, 'accept')}
                  style={{ ...styles.acceptBtn, opacity: actionLoading ? 0.6 : 1 }}
                >
                  {actionLoading === g._id + 'accept' ? 'Accepting...' : '✓ Accept'}
                </button>
                <button
                  disabled={!!actionLoading}
                  onClick={() => respond(g._id, 'reject')}
                  style={{ ...styles.declineBtn, opacity: actionLoading ? 0.6 : 1 }}
                >
                  {actionLoading === g._id + 'reject' ? '...' : '✗ Decline'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Joined Groups */}
      {myJoinedGroups.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>✓ My Groups ({myJoinedGroups.length})</h3>
          {myJoinedGroups.map((g) => (
            <div key={g._id} style={styles.infoCard}>
              <div style={styles.badgeRow}>
                <span style={styles.statusBadge(g.status)}>{g.status.replace('_', ' ')}</span>
                <span style={styles.supervisorText}>
                  Supervisor: <b style={{ color: '#1e293b' }}>{g.professor?.name || 'TBD'}</b>
                </span>
              </div>

              <h3 style={styles.cardHeading}>{g.title || 'Untitled Project'}</h3>
              
              <div style={styles.teamList}>
                {g.members.map((m) => (
                  <div key={m.student._id} style={styles.teamChip}>
                    <span style={styles.initial}>{m.student.name.charAt(0)}</span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={styles.chipName}>{m.student.name}</div>
                      <div style={styles.statusText(m.status)}>{m.status}</div>
                    </div>
                  </div>
                ))}
              </div>

              {g.status === 'pending_members' && (
                <div style={styles.waitingNotice}>⏳ Waiting for other members to accept</div>
              )}
              {g.status === 'pending_professor' && (
                <div style={styles.waitingNotice}>⏳ Waiting for professor approval</div>
              )}
              {g.status === 'approved' && (
                <div style={styles.successNotice}>✓ Group approved! Your team is official.</div>
              )}
              {g.status === 'rejected' && (
                <div style={styles.rejectedNotice}>✗ This group request was rejected.</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {myInvitations.length === 0 && myJoinedGroups.length === 0 && (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <p style={styles.emptyText}>No invitations found</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { width: '100%', maxWidth: '100%' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f1f5f9', borderTop: '4px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  title: { fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' },
  smallMuted: { fontSize: '0.875rem', color: '#64748b', fontWeight: '500', marginBottom: '1.5rem', display: 'block' },
  section: { marginBottom: '2.5rem' },
  sectionTitle: { fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' },
  card: { background: '#ffffff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '2px solid #fbbf24', marginBottom: '1.5rem' },
  infoCard: { background: '#ffffff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9', marginBottom: '1.5rem' },
  badgeRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', flexWrap: 'wrap' },
  statusBadge: (status) => ({
    padding: '0.375rem 0.875rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase',
    background: status === 'approved' ? '#ecfdf5' : status === 'rejected' ? '#fee2e2' : '#f0f7ff',
    color: status === 'approved' ? '#059669' : status === 'rejected' ? '#dc2626' : '#2563eb',
  }),
  supervisorText: { fontSize: '0.875rem', color: '#64748b' },
  cardHeading: { fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' },
  teamTitle: { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' },
  teamList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' },
  teamChip: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9' },
  initial: { width: '32px', height: '32px', borderRadius: '8px', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
  chipName: { fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' },
  chipRoll: { fontSize: '0.75rem', color: '#64748b' },
  statusText: (status) => ({ fontSize: '0.75rem', fontWeight: '600', color: status === 'accepted' ? '#16a34a' : '#a16207' }),
  actions: { display: 'flex', gap: '10px', marginTop: '1.5rem' },
  acceptBtn: { flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' },
  declineBtn: { background: '#fff', color: '#dc2626', border: '1px solid #fecaca', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' },
  waitingNotice: { marginTop: '1rem', padding: '10px', background: '#fffbeb', color: '#92400e', borderRadius: '8px', fontSize: '0.875rem' },
  successNotice: { marginTop: '1rem', padding: '10px', background: '#f0fdf4', color: '#15803d', borderRadius: '8px', fontSize: '0.875rem' },
  rejectedNotice: { marginTop: '1rem', padding: '10px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', fontSize: '0.875rem' },
  empty: { textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '1.5rem', border: '2px dashed #e2e8f0' },
  emptyIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  emptyText: { color: '#64748b', fontWeight: '600' },
  errorBox: { padding: '1.5rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', textAlign: 'center' },
  retryBtn: { marginTop: '1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }
};

export default StudentGroupInvitations;