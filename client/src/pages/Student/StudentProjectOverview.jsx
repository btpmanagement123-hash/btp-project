import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentProjectOverview = () => {
  const [group, setGroup] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, reqRes] = await Promise.all([
          api.get('/student/me'),
          api.get('/student/group-requests')
        ]);
        
        setMe(meRes.data);
        const list = reqRes.data || [];
        setRequests(list);
        
        // Find approved group
        const approved = list.find((r) => r.status === 'approved');
        if (approved) {
          setGroup(approved);
        }
      } catch (err) {
        console.error('student group-requests error', err);
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
        <p style={styles.loadingText}>Loading project overview...</p>
      </div>
    );
  }

  if (!group && requests.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📋</div>
        <h3 style={styles.emptyTitle}>No Project Registered Yet</h3>
        <p style={styles.emptyText}>
          You haven't registered for a BTP project yet. Create a group from the Registration page to get started.
        </p>
      </div>
    );
  }

  // Find the most relevant request to show
  const latest = requests.length > 0 ? requests[0] : null;
  
  // Get user's current status
  const getUserStatus = () => {
    if (!latest || !me) return null;
    
    const userIdStr = String(me._id);
    const isLeader = String(latest.leader?._id) === userIdStr;
    
    if (isLeader) {
      return {
        role: 'Leader',
        status: latest.status
      };
    }
    
    const memberStatus = latest.members?.find(
      (m) => String(m.student?._id) === userIdStr
    )?.status;
    
    return {
      role: 'Member',
      status: memberStatus || 'unknown'
    };
  };

  const userStatus = getUserStatus();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Project Overview</h2>

      {latest && (
        <div style={styles.statusBar}>
          <div style={styles.statusLeft}>
            <span style={styles.statusBadge(latest.status)}>
              {latest.status.replace('_', ' ')}
            </span>
            {userStatus && (
              <span style={styles.roleBadge}>
                {userStatus.role}
              </span>
            )}
          </div>
          <span style={styles.supervisorText}>
            Supervisor: <b style={{ color: '#1e293b' }}>{latest.professor?.name || 'TBD'}</b>
          </span>
        </div>
      )}

      {/* Show status-specific messages */}
      {latest && latest.status === 'pending_members' && (
        <div style={styles.infoBox('warning')}>
          <div style={styles.infoIcon}>⏳</div>
          <div>
            <h4 style={styles.infoTitle}>Waiting for Team Responses</h4>
            <p style={styles.infoText}>
              Some team members haven't accepted the invitation yet. Check the "Group Invitations" tab for details.
            </p>
          </div>
        </div>
      )}

      {latest && latest.status === 'pending_professor' && (
        <div style={styles.infoBox('info')}>
          <div style={styles.infoIcon}>🎓</div>
          <div>
            <h4 style={styles.infoTitle}>Pending Professor Approval</h4>
            <p style={styles.infoText}>
              All team members have accepted! Waiting for {latest.professor?.name || 'your supervisor'} to approve the group.
            </p>
          </div>
        </div>
      )}

      {latest && latest.status === 'rejected' && (
        <div style={styles.infoBox('error')}>
          <div style={styles.infoIcon}>❌</div>
          <div>
            <h4 style={styles.infoTitle}>Request Rejected</h4>
            <p style={styles.infoText}>
              This group request was rejected. You can create a new registration from the Registration tab.
            </p>
          </div>
        </div>
      )}

      {group && group.status === 'approved' && (
        <div style={styles.infoBox('success')}>
          <div style={styles.infoIcon}>✅</div>
          <div>
            <h4 style={styles.infoTitle}>Group Approved!</h4>
            <p style={styles.infoText}>
              Congratulations! Your BTP group is now official and registered for this academic session.
            </p>
          </div>
        </div>
      )}

      {/* Project Details Card */}
      {(group || latest) && (
        <div style={styles.card}>
          <h3 style={styles.cardHeading}>
            {(group || latest).title || 'BTP Project'}
          </h3>
          
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Supervisor</span>
            <span style={styles.metaValue}>
              {(group || latest).professor?.name || 'Not assigned'}
            </span>
          </div>
          
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Session</span>
            <span style={styles.metaValue}>{(group || latest).session}</span>
          </div>
          
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Status</span>
            <span style={styles.metaValue}>
              {(group || latest).status.replace('_', ' ')}
            </span>
          </div>

          {/* Only show leader role if NOT approved - approved teams have no leader */}
          {latest && latest.status !== 'approved' && String(latest.leader?._id) === String(me?._id) && (
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>Your Role</span>
              <span style={styles.metaValue}>👑 Group Leader</span>
            </div>
          )}

          <h4 style={styles.teamTitle}>
            {(group || latest).status === 'approved' ? 'Team Members' : 'Student Team'} ({(group || latest).members?.length || 0})
          </h4>
          
          <div style={styles.teamList}>
            {(group || latest).members?.map((m) => {
              const studentData = m.student || m;
              const studentId = studentData._id;
              const studentName = studentData.name || studentData.studentName || 'Student';
              const studentRoll = studentData.userId || studentData.rollNo || '';
              const isCurrentUser = String(studentId) === String(me?._id);
              const memberStatus = m.status;
              const isApproved = (group || latest).status === 'approved';

              return (
                <div key={studentId} style={styles.teamChip}>
                  <span style={styles.initial}>
                    {studentName.charAt(0).toUpperCase()}
                  </span>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={styles.chipName}>
                      {studentName}
                      {isCurrentUser && ' (You)'}
                    </div>
                    <div style={styles.chipRoll}>{studentRoll}</div>
                    {/* Don't show member status for approved teams - everyone is equal */}
                    {memberStatus && !isApproved && (
                      <div style={styles.memberStatus(memberStatus)}>
                        {memberStatus}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: '#f8fafc',
    borderRadius: '1.5rem',
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
    marginBottom: '0.75rem'
  },
  emptyText: {
    fontSize: '0.9375rem',
    color: '#64748b',
    lineHeight: '1.6',
    maxWidth: '500px',
    margin: '0 auto'
  },
  title: { 
    fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', 
    fontWeight: '800', 
    marginBottom: '1rem', 
    color: '#0f172a',
    letterSpacing: '-0.025em'
  },
  statusBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '12px'
  },
  statusLeft: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  statusBadge: (status) => ({
    padding: '0.375rem 0.875rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    background:
      status === 'approved'
        ? '#ecfdf5'
        : status === 'rejected'
        ? '#fff1f2'
        : '#f0f7ff',
    color:
      status === 'approved'
        ? '#059669'
        : status === 'rejected'
        ? '#e11d48'
        : '#2563eb',
    border: `1px solid ${
      status === 'approved' 
        ? '#10b98133' 
        : status === 'rejected' 
        ? '#f43f5e33' 
        : '#3b82f633'
    }`
  }),
  roleBadge: {
    padding: '0.375rem 0.875rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    background: '#f3e8ff',
    color: '#7c3aed',
    border: '1px solid #e9d5ff'
  },
  supervisorText: { 
    fontSize: '0.875rem', 
    color: '#64748b',
    fontWeight: '500'
  },
  infoBox: (type) => ({
    display: 'flex',
    gap: '1rem',
    padding: '1.25rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    background: 
      type === 'success' ? '#f0fdf4' :
      type === 'error' ? '#fef2f2' :
      type === 'warning' ? '#fffbeb' :
      '#f0f9ff',
    border: `1px solid ${
      type === 'success' ? '#bbf7d0' :
      type === 'error' ? '#fecaca' :
      type === 'warning' ? '#fde68a' :
      '#bfdbfe'
    }`
  }),
  infoIcon: {
    fontSize: '1.5rem',
    flexShrink: 0
  },
  infoTitle: {
    fontSize: '0.9375rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  infoText: {
    fontSize: '0.875rem',
    color: '#475569',
    lineHeight: '1.5',
    margin: 0
  },
  card: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: 'clamp(1.25rem, 5vw, 2rem)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9',
    width: '100%',
    boxSizing: 'border-box'
  },
  cardHeading: { 
    fontSize: 'clamp(1.125rem, 4vw, 1.375rem)', 
    fontWeight: '800', 
    marginBottom: '1.25rem', 
    color: '#1e293b',
    lineHeight: '1.3'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9375rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f8fafc'
  },
  metaLabel: { 
    color: '#94a3b8', 
    fontWeight: '500',
    flexShrink: 0
  },
  metaValue: { 
    color: '#334155', 
    fontWeight: '700',
    textAlign: 'right',
    wordBreak: 'break-word',
    textTransform: 'capitalize'
  },
  teamTitle: { 
    marginTop: '2rem', 
    fontSize: '0.8125rem', 
    fontWeight: '700', 
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  teamList: { 
    marginTop: '1rem', 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))', 
    gap: '0.75rem' 
  },
  teamChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    borderRadius: '1rem',
    background: '#f8fafc',
    border: '1px solid #f1f5f9',
    boxSizing: 'border-box'
  },
  initial: {
    width: '36px',
    height: '36px',
    flexShrink: 0,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '700',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
  },
  chipName: { 
    fontSize: '0.875rem', 
    fontWeight: '700', 
    color: '#1e293b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chipRoll: { 
    fontSize: '0.75rem', 
    color: '#64748b', 
    marginTop: '2px' 
  },
  memberStatus: (status) => ({
    fontSize: '0.7rem',
    fontWeight: '600',
    textTransform: 'capitalize',
    marginTop: '4px',
    color: status === 'accepted' ? '#16a34a' : status === 'rejected' ? '#dc2626' : '#a16207'
  })
};

export default StudentProjectOverview;