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
    marginBottom: '24px',
    lineHeight: '1.5' 
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
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    display: 'flex',
    flexWrap: 'wrap', // Better for smaller screens
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s ease'
  },
  groupTitle: { 
    fontSize: '18px', 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: '8px',
    lineHeight: '1.4'
  },
  meta: { 
    fontSize: '13px', 
    color: '#6366f1', // Indigo to make meta info pop
    fontWeight: '600',
    backgroundColor: '#eef2ff',
    padding: '4px 10px',
    borderRadius: '6px',
    display: 'inline-block'
  },
  membersCol: {
    minWidth: '280px',
    flex: '1',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '10px'
  },
  memberChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    borderRadius: '12px',
    background: '#f8fafc',
    border: '1px solid #eff6ff'
  },
  initial: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    border: '1px solid #cbd5e1'
  },
  memberName: { 
    fontSize: '13px', 
    fontWeight: '600', 
    color: '#334155' 
  },
  memberRoll: { 
    fontSize: '11px', 
    color: '#94a3b8',
    fontWeight: '500' 
  }
};

export default ProfessorGroupsOverview;
