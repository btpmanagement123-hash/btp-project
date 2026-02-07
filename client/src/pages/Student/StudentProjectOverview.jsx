import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentProjectOverview = () => {
  const [group, setGroup] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/student/group-requests');
        const list = res.data || [];
        setRequests(list);
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

  if (loading) return <p>Loading...</p>;

  if (!group && requests.length === 0) {
    return (
      <p style={{ fontSize: 14, color: '#6b7280' }}>
        No project registered yet. Create a group from the Registration page.
      </p>
    );
  }

  const latest = requests[0];

  return (
    <div>
      <h2 style={styles.title}>Project Overview</h2>

      {latest && (
        <div style={styles.badgeRow}>
          <span style={styles.statusBadge(latest.status)}>
            {latest.status.replace('_', ' ')}
          </span>
          <span style={styles.smallMuted}>
            Supervisor: {latest.professor?.name || 'TBD'}
          </span>
        </div>
      )}

      {group && (
        <div style={styles.card}>
          <h3 style={styles.cardHeading}>{group.title || 'BTP Project'}</h3>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Supervisor</span>
            <span style={styles.metaValue}>
              {group.professor?.name || 'Not assigned'}
            </span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Session</span>
            <span style={styles.metaValue}>{group.session}</span>
          </div>

          <h4 style={styles.teamTitle}>Student Team</h4>
          <div style={styles.teamList}>
            {group.members.map((m) => (
              <div key={m.student?._id || m._id} style={styles.teamChip}>
                <span style={styles.initial}>
                  {(m.student?.name || m.studentName || '?')[0]}
                </span>
                <div>
                  <div style={styles.chipName}>
                    {m.student?.name || m.studentName || 'Student'}
                  </div>
                  <div style={styles.chipRoll}>
                    {m.student?.userId || m.rollNo || ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  title: { 
    fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', 
    fontWeight: '800', 
    marginBottom: '1rem', 
    color: '#0f172a',
    letterSpacing: '-0.025em'
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '1.5rem'
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
  smallMuted: { 
    fontSize: '0.875rem', 
    color: '#64748b',
    fontWeight: '500'
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
    wordBreak: 'break-word'
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
  }
};

export default StudentProjectOverview;
