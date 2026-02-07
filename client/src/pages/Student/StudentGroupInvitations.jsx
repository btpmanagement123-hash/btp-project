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
      setError('Failed to load invitations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (groupId, action) => {
    // Confirm rejection to prevent accidental clicks
    if (action === 'rejected' && !window.confirm('Are you sure you want to decline this invitation?')) return;

    setActionLoading(groupId + action);
    try {
      await api.post(`/student/group-requests/${groupId}/respond`, { action });
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) return (
    <div style={styles.page}>
      <div style={styles.skeletonContainer}>
        <div style={styles.skeletonTitle}></div>
        <div style={styles.skeletonCard}></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div style={styles.page}>
      <div style={styles.errorBox}>
        <p>{error}</p>
        <button onClick={load} style={styles.retryBtn}>Retry</button>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Group Invitations</h2>
      <p style={styles.subtitle}>
        Manage your Final Year Project (BTP) group invitations.
      </p>

      {groups.length === 0 ? (
        <div style={styles.empty}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <p style={{ marginTop: '16px' }}>No pending invitations found.</p>
        </div>
      ) : (
        groups.map((g) => {
          const myMember = g.members.find(m => m.student._id === me?._id);
          const canRespond = myMember && myMember.status === 'pending' && String(g.leader._id) !== String(me?._id);

          return (
            <div key={g._id} style={styles.card}>
              <div style={styles.header}>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.titleText}>{g.title || 'Untitled Project'}</h3>
                  <div style={styles.metaRow}>
                    <span style={styles.metaItem}><b>Supervisor:</b> {g.professor.name}</span>
                  </div>
                </div>
                <span style={styles.badge}>{g.status.replace('_', ' ')}</span>
              </div>

              <div style={styles.membersBox}>
                <span style={styles.memberTitle}>Group Members ({g.members.length})</span>
                <div style={styles.memberList}>
                  {g.members.map((m) => (
                    <div key={m.student._id} style={styles.memberRow}>
                      <div style={styles.memberInfo}>
                        <div style={styles.avatar}>{m.student.name.charAt(0)}</div>
                        <span style={styles.memberName}>{m.student.name}</span>
                      </div>
                      <span style={{
                        ...styles.statusTag,
                        backgroundColor: m.status === 'accepted' ? '#dcfce7' : m.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                        color: m.status === 'accepted' ? '#16a34a' : m.status === 'rejected' ? '#dc2626' : '#a16207'
                      }}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {canRespond && (
                <div style={styles.actions}>
                  <button
                    disabled={!!actionLoading}
                    onClick={() => respond(g._id, 'accepted')}
                    style={{ ...styles.btn, background: '#16a34a' }}
                  >
                    {actionLoading === g._id + 'accepted' ? 'Processing...' : 'Accept Invitation'}
                  </button>
                  <button
                    disabled={!!actionLoading}
                    onClick={() => respond(g._id, 'rejected')}
                    style={{ ...styles.btn, background: '#fff', color: '#dc2626', border: '1px solid #fecaca' }}
                  >
                    {actionLoading === g._id + 'rejected' ? 'Processing...' : 'Decline'}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: 'clamp(16px, 5vw, 40px) 16px',
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  title: { fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: '800', color: '#0f172a', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748b', marginBottom: '32px' },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: 'clamp(16px, 4vw, 24px)',
    marginBottom: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  header: { display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' },
  titleText: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#64748b' },
  badge: { 
    background: '#eff6ff', color: '#2563eb', padding: '4px 10px', 
    borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', height: 'fit-content'
  },
  membersBox: { background: '#f8fafc', borderRadius: '12px', padding: '16px' },
  memberTitle: { fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', display: 'block' },
  memberRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' },
  memberInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '28px', height: '28px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' },
  memberName: { fontSize: '14px', color: '#334155', fontWeight: '500' },
  statusTag: { fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' },
  actions: { display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' },
  btn: {
    flex: 1, minWidth: '140px', padding: '12px', borderRadius: '10px', 
    border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
    transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#fff'
  },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#94a3b8', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' },
  errorBox: { textAlign: 'center', padding: '24px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2', color: '#b91c1c' },
  retryBtn: { marginTop: '12px', padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  skeletonContainer: { opacity: 0.5 },
  skeletonTitle: { height: '32px', width: '200px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '20px' },
  skeletonCard: { height: '200px', width: '100%', background: '#e2e8f0', borderRadius: '20px' }
};

export default StudentGroupInvitations;