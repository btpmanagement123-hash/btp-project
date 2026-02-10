import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorGroupsOverview = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const res = await api.get('/professor/groups');
        setGroups(res.data || []);
      } catch (err) {
        console.error('professor groups error', err);
        setError('Failed to load groups. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button onClick={() => window.location.reload()} style={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Group Supervision Centre</h2>
      <p style={styles.subtitle}>
        Overview of BTP groups under your supervision for the current academic session.
      </p>

      {groups.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎓</div>
          <h3 style={styles.emptyTitle}>No Groups Assigned Yet</h3>
          <p style={styles.emptyText}>
            Once you approve group requests, they will appear here. Check the "Manage Groups" tab to review pending requests.
          </p>
        </div>
      )}

      <div style={styles.list}>
        {groups.map((g) => (
          <div key={g._id} style={styles.card}>
            <div style={styles.groupInfo}>
              <h3 style={styles.groupTitle}>
                {g.title || 'BTP Project'}
              </h3>
              <div style={styles.metaRow}>
                <span style={styles.metaBadge}>
                  📅 Session {g.session}
                </span>
                <span style={styles.metaBadge}>
                  👥 {g.members?.length || 0} student{g.members?.length !== 1 ? 's' : ''}
                </span>
              </div>
              {g.domain && (
                <div style={styles.domainTag}>
                  🔬 {g.domain}
                </div>
              )}
            </div>

            <div style={styles.membersCol}>
              {g.members?.map((m) => {
                const memberData = m.student || m;
                const memberId = memberData._id;
                const memberName = memberData.name || 'Unknown';
                const memberRoll = memberData.userId || '-';

                return (
                  <div key={memberId} style={styles.memberChip}>
                    <span style={styles.initial}>
                      {memberName.charAt(0).toUpperCase()}
                    </span>
                    <div style={styles.memberInfo}>
                      <div style={styles.memberName}>{memberName}</div>
                      <div style={styles.memberRoll}>{memberRoll}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { 
    width: '100%', 
    maxWidth: '100%' 
  },
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
    marginBottom: '1.5rem',
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
    lineHeight: '1.6',
    maxWidth: '500px',
    margin: '0 auto'
  },
  list: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: '#ffffff',
    borderRadius: '24px',
    padding: 'clamp(16px, 4vw, 28px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease'
  },
  groupInfo: {
    flex: '1',
    minWidth: '250px'
  },
  groupTitle: { 
    fontSize: '18px', 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: '12px',
    lineHeight: '1.4'
  },
  metaRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '8px'
  },
  metaBadge: { 
    fontSize: '12px', 
    color: '#4f46e5',
    fontWeight: '700',
    backgroundColor: '#eef2ff',
    padding: '6px 12px',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  domainTag: {
    display: 'inline-block',
    fontSize: '13px',
    color: '#065f46',
    fontWeight: '600',
    backgroundColor: '#d1fae5',
    padding: '6px 12px',
    borderRadius: '8px',
    marginTop: '8px'
  },
  membersCol: {
    flex: '2',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    width: '100%'
  },
  memberChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '16px',
    background: '#f8fafc',
    border: '1px solid #f1f5f9',
    transition: 'background 0.2s ease'
  },
  initial: {
    width: '36px',
    height: '36px',
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
  memberInfo: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: 1
  },
  memberName: { 
    fontSize: '13px', 
    fontWeight: '600', 
    color: '#334155',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  memberRoll: { 
    fontSize: '11px', 
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: '0.01em',
    marginTop: '2px'
  }
};

export default ProfessorGroupsOverview;