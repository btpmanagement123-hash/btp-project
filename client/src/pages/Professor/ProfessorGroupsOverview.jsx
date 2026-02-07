import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorGroupsOverview = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/professor/groups');
        setGroups(res.data || []);
      } catch (err) {
        console.error('professor groups error', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2 style={styles.title}>Group Supervision Centre</h2>
      <p style={styles.subtitle}>
        Overview of BTP groups under your supervision will appear here.
      </p>

      {loading && <p style={styles.muted}>Loading...</p>}

      {!loading && groups.length === 0 && (
        <p style={styles.muted}>No groups assigned yet for this session.</p>
      )}

      <div style={styles.list}>
        {groups.map((g) => (
          <div key={g._id} style={styles.card}>
            <div style={{ flex: 1 }}>
              <h3 style={styles.groupTitle}>
                {g.title || 'BTP Project'}
              </h3>
              <p style={styles.meta}>
                Session {g.session} · {g.members.length} student(s)
              </p>
            </div>
            <div style={styles.membersCol}>
              {g.members.map((m) => (
                <div key={m._id} style={styles.memberChip}>
                  <span style={styles.initial}>
                    {(m.name || '?')[0]}
                  </span>
                  <div>
                    <div style={styles.memberName}>{m.name}</div>
                    <div style={styles.memberRoll}>{m.userId}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  // Main header styling
  title: { 
    fontSize: 'clamp(20px, 5vw, 26px)', // Fluid font size
    fontWeight: '800', 
    color: '#0f172a', 
    letterSpacing: '-0.025em',
    marginBottom: '8px' 
  },
  subtitle: { 
    fontSize: 'clamp(14px, 3.5vw, 15px)', 
    color: '#64748b', 
    marginBottom: '32px',
    lineHeight: '1.6' 
  },
  
  // Empty state / No groups found
  muted: { 
    fontSize: '15px', 
    color: '#94a3b8', 
    textAlign: 'center', 
    padding: 'clamp(30px, 8vw, 60px)',
    background: '#f8fafc',
    borderRadius: '20px',
    border: '2px dashed #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },

  list: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  // Main Group Card
  card: {
    display: 'flex',
    flexDirection: 'column', // Mobile-first stack
    gap: '20px',
    background: '#ffffff',
    borderRadius: '24px',
    padding: 'clamp(16px, 4vw, 28px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease',
    // Desktop layout adjustment:
    '@media (minWidth: 768px)': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  },

  groupInfo: {
    flex: '1',
    minWidth: '250px'
  },
  groupTitle: { 
    fontSize: '18px', 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: '10px',
    lineHeight: '1.4'
  },
  meta: { 
    fontSize: '12px', 
    color: '#4f46e5', // Direct indigo
    fontWeight: '700',
    backgroundColor: '#eef2ff',
    padding: '6px 12px',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },

  // Responsive Grid for members
  membersCol: {
    flex: '2',
    display: 'grid',
    // Adapts columns based on available container width
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
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', // Colorful initials
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0 // Prevents squishing in tight grids
  },

  nameStack: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
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
    letterSpacing: '0.01em'
  }
};

export default ProfessorGroupsOverview;
