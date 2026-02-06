
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

const styles = {
  page: {
    maxWidth: '850px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    color: '#1e293b'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '-0.025em',
    marginBottom: '8px',
    color: '#0f172a'
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    marginBottom: '32px',
    lineHeight: '1.5'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '2px dashed #e2e8f0',
    color: '#94a3b8',
    fontSize: '15px'
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '20px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    borderBottom: '1px solid #f8fafc',
    paddingBottom: '16px'
  },
  titleText: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
    color: '#1e293b'
  },
  badge: {
    background: '#f0f9ff',
    color: '#0369a1',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  meta: {
    fontSize: '14px',
    color: '#475569',
    margin: '6px 0',
    display: 'flex',
    alignItems: 'center'
  },
  members: {
    marginTop: '20px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px'
  },
  memberTitle: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  memberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #eff6ff'
  },
  status: {
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px',
    textTransform: 'capitalize'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  btn: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }
};

export default StudentGroupInvitations;
