// import { useEffect, useState } from 'react';
// import api from '../../api/axios';

// const ProfessorGroupsOverview = () => {
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await api.get('/professor/groups');
//         setGroups(res.data);
//       } catch (err) {
//         console.error('groups error', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2 style={styles.title}>Group Supervision Centre</h2>
//       <p style={styles.subtitle}>
//         Overview of BTP groups under your supervision will appear here.
//       </p>

//       {groups.length === 0 && (
//         <p style={styles.empty}>No groups assigned yet for this session.</p>
//       )}

//       <div style={styles.list}>
//         {groups.map((g) => (
//           <div key={g._id} style={styles.card}>
//             <div>
//               <p style={styles.groupName}>{g.name}</p>
//               {g.title && <p style={styles.groupTitle}>{g.title}</p>}
//               <p style={styles.meta}>
//                 {g.members.length} member(s) · Session {g.session}
//               </p>
//             </div>
//             <div>
//               {g.members.map((m) => (
//                 <p key={m._id} style={styles.member}>
//                   {m.rollNo && `${m.rollNo} · `}{m.name || m.student?.name}
//                 </p>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   title: { fontSize: 20, fontWeight: 600, marginBottom: 4 },
//   subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 16 },
//   empty: { fontSize: 13, color: '#6b7280' },
//   list: { marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 },
//   card: {
//     background: '#fff',
//     borderRadius: 16,
//     padding: 14,
//     display: 'flex',
//     justifyContent: 'space-between',
//     boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
//   },
//   groupName: { fontSize: 15, fontWeight: 600 },
//   groupTitle: { fontSize: 13, color: '#4b5563' },
//   meta: { fontSize: 12, color: '#6b7280', marginTop: 4 },
//   member: { fontSize: 12, color: '#4b5563' }
// };

// export default ProfessorGroupsOverview;
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
  title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 16 },
  muted: { fontSize: 13, color: '#6b7280' },
  list: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    background: '#ffffff',
    borderRadius: 18,
    padding: 16,
    boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
  },
  groupTitle: { fontSize: 16, fontWeight: 600, marginBottom: 4 },
  meta: { fontSize: 12, color: '#6b7280' },
  membersCol: {
    minWidth: 260,
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  memberChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    borderRadius: 12,
    background: '#f9fafb'
  },
  initial: {
    width: 26,
    height: 26,
    borderRadius: '999px',
    background: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600
  },
  memberName: { fontSize: 13, fontWeight: 500 },
  memberRoll: { fontSize: 11, color: '#6b7280' }
};

export default ProfessorGroupsOverview;
