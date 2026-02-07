import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorManageGroups = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({ id: null, type: null });

  const load = async () => {
    try {
      const res = await api.get('/professor/group-requests');
      setRequests(res.data || []);
    } catch (err) {
      console.error('professor group-requests error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDecision = async (id, action) => {
    if (action === 'reject' && !window.confirm('Are you sure you want to reject this group request?')) {
      return;
    }

    setProcessing({ id, type: action });
    try {
      await api.post(`/professor/group-requests/${id}/decide`, { action });
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing({ id: null, type: null });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Group Requests</h2>
      <p style={styles.subtitle}>
        Review registration requests from students and finalize their group formation.
      </p>

      {loading && (
        <div style={styles.muted}>
          <div className="spinner"></div> {/* You can add a CSS spinner here */}
          <p>Loading requests...</p>
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div style={styles.muted}>
          <p>No pending group requests at the moment.</p>
        </div>
      )}

      <div style={styles.list}>
        {requests.map((r) => (
          <div key={r._id} style={styles.card}>
            <div style={styles.infoCol}>
              <div style={styles.headerRow}>
                <h3 style={styles.reqTitle}>{r.title || 'Untitled BTP Project'}</h3>
                <span style={styles.badge}>New Request</span>
              </div>
              
              <div style={styles.metaContainer}>
                <p style={styles.metaLine}>
                  <strong>Leader:</strong> {r.leader?.name} <span style={styles.idTag}>{r.leader?.userId}</span>
                </p>
                <p style={styles.metaLine}>
                  <strong>Session:</strong> {r.session}
                </p>
              </div>

              <h4 style={styles.teamTitle}>Proposed Team Members</h4>
              <div style={styles.teamList}>
                {r.members.map((m) => (
                  <div key={m.student?._id} style={styles.teamChip}>
                    <span style={styles.initial}>
                      {(m.student?.name || '?')[0]}
                    </span>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={styles.memberName}>{m.student?.name}</div>
                      <div style={styles.memberRoll}>{m.student?.userId}</div>
                      <div style={styles.memberStatus(m.status)}>
                        {m.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.actionsCol}>
              <button
                disabled={processing.id !== null}
                onClick={() => handleDecision(r._id, 'approve')}
                style={{
                  ...styles.approveBtn,
                  opacity: processing.id === r._id && processing.type === 'approve' ? 0.7 : 1
                }}
              >
                {processing.id === r._id && processing.type === 'approve' ? 'Approving...' : 'Approve Group'}
              </button>
              
              <button
                disabled={processing.id !== null}
                onClick={() => handleDecision(r._id, 'reject')}
                style={{
                  ...styles.rejectBtn,
                  opacity: processing.id === r._id && processing.type === 'reject' ? 0.7 : 1
                }}
              >
                {processing.id === r._id && processing.type === 'reject' ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    paddingBottom: '40px'
  },
  title: { 
    fontSize: 'clamp(22px, 5vw, 26px)', 
    fontWeight: '800', 
    color: '#0f172a', 
    letterSpacing: '-0.025em',
    marginBottom: '4px' 
  },
  subtitle: { 
    fontSize: '15px', 
    color: '#64748b', 
    marginBottom: '32px',
    lineHeight: '1.5'
  },
  muted: { 
    fontSize: '15px', 
    color: '#94a3b8', 
    textAlign: 'center', 
    padding: '60px 20px',
    background: '#f8fafc',
    borderRadius: '24px',
    border: '2px dashed #e2e8f0'
  },
  list: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap', // Key for mobile responsiveness
    gap: '24px',
    background: '#ffffff',
    borderRadius: '24px',
    padding: 'clamp(16px, 4vw, 28px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9'
  },
  infoCol: { 
    flex: '1 1 500px', // Shrinks and grows, but breaks to new line if less than 500px
    minWidth: '300px'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '12px'
  },
  reqTitle: { 
    fontSize: '19px', 
    fontWeight: '700', 
    color: '#1e293b',
    lineHeight: '1.4',
    margin: 0
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '10px',
    fontSize: '11px',
    background: '#e0e7ff',
    color: '#4338ca',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap'
  },
  metaContainer: {
    marginBottom: '20px'
  },
  metaLine: { 
    fontSize: '14px', 
    color: '#475569',
    marginBottom: '6px',
  },
  idTag: {
    background: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    marginLeft: '4px'
  },
  teamTitle: { 
    fontSize: '12px', 
    fontWeight: '700', 
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px'
  },
  teamList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px'
  },
  teamChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '16px',
    background: '#f8fafc',
    border: '1px solid #eff6ff'
  },
  initial: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0
  },
  memberName: { 
    fontSize: '13px', 
    fontWeight: '600', 
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  memberRoll: { fontSize: '11px', color: '#64748b' },
  memberStatus: (status) => ({
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: '4px',
    color: status === 'accepted' ? '#059669' : status === 'rejected' ? '#dc2626' : '#94a3b8'
  }),
  actionsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '180px',
    justifyContent: 'center',
    flex: '1 1 180px'
  },
  approveBtn: {
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    background: '#059669',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
  },
  rejectBtn: {
    padding: '14px',
    borderRadius: '14px',
    border: '1px solid #fecaca',
    background: '#fff',
    color: '#be123c',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default ProfessorManageGroups;