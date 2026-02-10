import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorManageGroups = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({ id: null, type: null });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const res = await api.get('/professor/group-requests');
      setRequests(res.data || []);
    } catch (err) {
      console.error('professor group-requests error', err);
      setError('Failed to load group requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDecision = async (id, action) => {
    const confirmMsg = action === 'reject' 
      ? 'Are you sure you want to reject this group request? The students will be notified and can create a new request.'
      : 'Approve this group? This will finalize the group formation and create their official BTP team.';
    
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setProcessing({ id, type: action });
    try {
      await api.post(`/professor/group-requests/${id}/decide`, { action });
      
      // Show success message
      const successMsg = action === 'approve' 
        ? '✓ Group approved successfully!' 
        : '✗ Group request rejected';
      
      console.log(successMsg);
      
      // Reload data
      await load();
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Action failed. Please try again.';
      alert(errorMsg);
      console.error('Decision error:', err);
    } finally {
      setProcessing({ id: null, type: null });
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading group requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button onClick={load} style={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Group Requests</h2>
      <p style={styles.subtitle}>
        Review registration requests from students and finalize their group formation.
      </p>

      {requests.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>No Pending Requests</h3>
          <p style={styles.emptyText}>
            No group requests are waiting for your approval at the moment.
          </p>
        </div>
      )}

      <div style={styles.list}>
        {requests.map((r) => {
          const isProcessing = processing.id === r._id;
          const allMembersAccepted = r.members?.every(m => m.status === 'accepted');
          
          return (
            <div key={r._id} style={styles.card}>
              <div style={styles.infoCol}>
                <div style={styles.headerRow}>
                  <h3 style={styles.reqTitle}>{r.title || 'Untitled BTP Project'}</h3>
                  <span style={styles.badge}>
                    {allMembersAccepted ? '✓ Ready for Review' : '⏳ Pending Members'}
                  </span>
                </div>
                
                <div style={styles.metaContainer}>
                  <p style={styles.metaLine}>
                    <strong>📅 Session:</strong> {r.session}
                  </p>
                  <p style={styles.metaLine}>
                    <strong>👥 Team Size:</strong> {r.members?.length || 0} members
                  </p>
                </div>

                {!allMembersAccepted && (
                  <div style={styles.warningBanner}>
                    ⚠️ Some members haven't accepted yet. Wait for all acceptances before approving.
                  </div>
                )}

                <h4 style={styles.teamTitle}>Proposed Team Members</h4>
                <div style={styles.teamList}>
                  {r.members?.map((m) => (
                    <div key={m.student?._id} style={styles.teamChip}>
                      <span style={styles.initial}>
                        {(m.student?.name || '?')[0].toUpperCase()}
                      </span>
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={styles.memberName}>{m.student?.name || 'Unknown'}</div>
                        <div style={styles.memberRoll}>{m.student?.userId || '-'}</div>
                        <div style={styles.memberStatus(m.status)}>
                          {m.status === 'accepted' && '✓ '}
                          {m.status === 'rejected' && '✗ '}
                          {m.status === 'pending' && '⏳ '}
                          {m.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.actionsCol}>
                <button
                  disabled={isProcessing || !allMembersAccepted}
                  onClick={() => handleDecision(r._id, 'approve')}
                  style={{
                    ...styles.approveBtn,
                    opacity: (isProcessing || !allMembersAccepted) ? 0.5 : 1,
                    cursor: (isProcessing || !allMembersAccepted) ? 'not-allowed' : 'pointer'
                  }}
                  title={!allMembersAccepted ? 'Wait for all members to accept' : 'Approve this group'}
                >
                  {isProcessing && processing.type === 'approve' 
                    ? 'Approving...' 
                    : '✓ Approve Group'}
                </button>
                
                <button
                  disabled={isProcessing}
                  onClick={() => handleDecision(r._id, 'reject')}
                  style={{
                    ...styles.rejectBtn,
                    opacity: isProcessing ? 0.5 : 1,
                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isProcessing && processing.type === 'reject' 
                    ? 'Rejecting...' 
                    : '✗ Reject'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', maxWidth: '100%' },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f1f5f9',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  errorContainer: {
    padding: '2rem',
    background: '#fef2f2',
    borderRadius: '16px',
    border: '1px solid #fecaca',
    textAlign: 'center'
  },
  errorText: {
    fontSize: '15px',
    color: '#dc2626',
    marginBottom: '1rem'
  },
  retryBtn: {
    padding: '10px 20px',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px'
  },
  title: { 
    fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', 
    fontWeight: '800', 
    marginBottom: '0.5rem', 
    color: '#0f172a',
    letterSpacing: '-0.025em' 
  },
  subtitle: { 
    fontSize: '0.875rem', 
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '2rem',
    display: 'block'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: '#f8fafc',
    borderRadius: '24px',
    border: '2px dashed #e2e8f0'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  emptyText: {
    fontSize: '0.9375rem',
    color: '#64748b',
    maxWidth: '500px',
    margin: '0 auto'
  },
  list: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '24px',
    background: '#ffffff',
    borderRadius: '24px',
    padding: 'clamp(16px, 4vw, 28px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9'
  },
  infoCol: { 
    flex: '1 1 500px',
    minWidth: '300px'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '12px',
    flexWrap: 'wrap'
  },
  reqTitle: { 
    fontSize: '19px', 
    fontWeight: '700', 
    color: '#1e293b',
    lineHeight: '1.4',
    margin: 0,
    flex: 1
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
    lineHeight: '1.6'
  },
  idTag: {
    background: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    marginLeft: '4px'
  },
  warningBanner: {
    padding: '10px 14px',
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#92400e',
    fontWeight: '600',
    marginBottom: '16px'
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
  memberRoll: { 
    fontSize: '11px', 
    color: '#64748b',
    marginTop: '2px'
  },
  memberStatus: (status) => ({
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: '4px',
    color: status === 'accepted' ? '#059669' : status === 'rejected' ? '#dc2626' : '#d97706'
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