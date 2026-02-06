
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
    setProcessing({ id, type: action }); // Set both ID and type (approve/reject)
      try {
        await api.post(`/professor/group-requests/${id}/decide`, { action });
        await load();
      } catch (err) {
        console.error('decide group request error', err);
      } finally {
        setProcessing({ id: null, type: null });
    }
  };

  return (
    <div>
      <h2 style={styles.title}>Manage Group Requests</h2>
      <p style={styles.subtitle}>
        Review incoming group registration requests and approve or reject them.
      </p>

      {loading && <p style={styles.muted}>Loading...</p>}

      {!loading && requests.length === 0 && (
        <p style={styles.muted}>No pending requests right now.</p>
      )}

      <div style={styles.list}>
        {requests.map((r) => (
          <div key={r._id} style={styles.card}>
            <div style={{ flex: 1 }}>
              <div style={styles.headerRow}>
                <h3 style={styles.reqTitle}>{r.title || 'BTP Project'}</h3>
                <span style={styles.badge}>New</span>
              </div>
              <p style={styles.metaLine}>
                Leader: {r.leader?.name} ({r.leader?.userId})
              </p>
              <p style={styles.metaLine}>Session: {r.session}</p>

              <h4 style={styles.teamTitle}>Proposed Team</h4>
              <div style={styles.teamList}>
                {r.members.map((m) => (
                  <div key={m.student?._id} style={styles.teamChip}>
                    <span style={styles.initial}>
                      {(m.student?.name || '?')[0]}
                    </span>
                    <div>
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
                disabled={processing.id === r._id}
                onClick={() => handleDecision(r._id, 'approve')}
                style={styles.approveBtn}
              >
                {processing.id === r._id && processing.type === 'approve' 
                  ? 'Approving...' 
                  : 'Approve'}
              </button>
              
              <button
                disabled={processing.id === r._id}
                onClick={() => handleDecision(r._id, 'reject')}
                style={styles.rejectBtn}
              >
                {processing.id === r._id && processing.type === 'reject' 
                  ? 'Rejecting...' 
                  : 'Reject'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  title: { 
    fontSize: '26px', 
    fontWeight: '800', 
    color: '#0f172a', 
    letterSpacing: '-0.025em',
    marginBottom: '4px' 
  },
  subtitle: { 
    fontSize: '15px', 
    color: '#64748b', 
    marginBottom: '24px' 
  },
  muted: { 
    fontSize: '14px', 
    color: '#94a3b8', 
    textAlign: 'center', 
    padding: '40px',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '2px dashed #e2e8f0'
  },
  list: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '16px' 
  },
  card: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  reqTitle: { 
    fontSize: '18px', 
    fontWeight: '700', 
    color: '#1e293b',
    lineHeight: '1.4'
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '12px',
    background: '#eef2ff',
    color: '#4f46e5',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  metaLine: { 
    fontSize: '13px', 
    color: '#64748b',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  teamTitle: { 
    marginTop: '20px', 
    fontSize: '12px', 
    fontWeight: '700', 
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  teamList: {
    marginTop: '12px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: '#ffffff',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    border: '1px solid #e2e8f0'
  },
  memberName: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  memberRoll: { fontSize: '12px', color: '#94a3b8' },
  memberStatus: (status) => ({
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: '4px',
    color:
      status === 'accepted'
        ? '#059669'
        : status === 'rejected'
        ? '#dc2626'
        : '#94a3b8'
  }),
  actionsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '160px',
    justifyContent: 'center'
  },
  approveBtn: {
    padding: '12px 0',
    borderRadius: '12px',
    border: 'none',
    background: '#059669',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)'
  },
  rejectBtn: {
    padding: '12px 0',
    borderRadius: '12px',
    border: '1px solid #fee2e2',
    background: '#fff1f2',
    color: '#be123c',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default ProfessorManageGroups;
