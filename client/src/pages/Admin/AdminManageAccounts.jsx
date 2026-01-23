// // // import { useEffect, useState } from 'react';
// // // import api from '../../api/axios';

// // // const AdminManageAccounts = () => {
// // //   const [users, setUsers] = useState([]);

// // //   useEffect(() => {
// // //     const load = async () => {
// // //       const res = await api.get('/admin/users');
// // //       setUsers(res.data);
// // //     };
// // //     load();
// // //   }, []);

// // //   return (
// // //     <div style={styles.wrapper}>
// // //       <h2 style={styles.title}>Manage Accounts</h2>
// // //       <table style={styles.table}>
// // //         <thead>
// // //           <tr>
// // //             <th>Email</th>
// // //             <th>Role</th>
// // //             <th>Session</th>
// // //             <th>Dept</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody>
// // //           {users.map(u => (
// // //             <tr key={u._id}>
// // //               <td>{u.email}</td>
// // //               <td>{u.role}</td>
// // //               <td>{u.session}</td>
// // //               <td>{u.department}</td>
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // };

// // // const styles = {
// // //   wrapper: { background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' },
// // //   title: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
// // //   table: {
// // //     width: '100%',
// // //     borderCollapse: 'collapse',
// // //     fontSize: 14
// // //   }
// // // };

// // // export default AdminManageAccounts;
// // import { useEffect, useState } from 'react';
// // import api from '../../api/axios';

// // const AdminManageAccounts = () => {
// //   const [users, setUsers] = useState([]);

// //   useEffect(() => {
// //     const load = async () => {
// //       const res = await api.get('/admin/users');
// //       setUsers(res.data);
// //     };
// //     load();
// //   }, []);

// //   return (
// //     <div style={styles.wrapper}>
// //       <h2 style={styles.title}>Manage Accounts</h2>
// //       <div style={{ overflowX: 'auto' }}>
// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th>Student / Staff ID</th>
// //               <th>Name</th>
// //               <th>Email</th>
// //               <th>Role</th>
// //               <th>Session</th>
// //               <th>Dept</th>
// //               <th>Mobile</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {users.map(u => (
// //               <tr key={u._id}>
// //                 <td>{u.userId || u.staffId || u.rollNo || '-'}</td>
// //                 <td>{u.name}</td>
// //                 <td>{u.email}</td>
// //                 <td>{u.role}</td>
// //                 <td>{u.session}</td>
// //                 <td>{u.department}</td>
// //                 <td>{u.mobile}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles = {
// //   wrapper: {
// //     background: '#fff',
// //     borderRadius: 18,
// //     padding: 24,
// //     boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
// //   },
// //   title: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
// //   table: {
// //     width: '100%',
// //     borderCollapse: 'collapse',
// //     fontSize: 14
// //   }
// // };

// // export default AdminManageAccounts;
// import { useEffect, useState } from 'react';
// import api from '../../api/axios';

// const AdminManageAccounts = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       const res = await api.get('/admin/users');
//       setUsers(res.data);
//     };
//     load();
//   }, []);

//   return (
//     <div style={styles.wrapper}>
//       <h2 style={styles.title}>Manage Accounts</h2>
//       <div style={{ overflowX: 'auto' }}>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th>Student / Staff ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Session</th>
//               <th>Dept</th>
//               <th>Mobile</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(u => (
//               <tr key={u._id}>
//                 <td>{u.userId || u.staffId || '-'}</td>
//                 <td>{u.name}</td>
//                 <td>{u.email}</td>
//                 <td>{u.role}</td>
//                 <td>{u.session}</td>
//                 <td>{u.department}</td>
//                 <td>{u.mobile}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     background: '#fff',
//     borderRadius: 18,
//     padding: 24,
//     boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
//   },
//   title: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
//   table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 }
// };

// export default AdminManageAccounts;
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

const AdminManageAccounts = () => {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const [uRes, sRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/sessions')
      ]);
      setUsers(uRes.data);
      setSessions(sRes.data);
    };
    load();
  }, []);

  const handleDeleteSession = async (id) => {
    if (!window.confirm('Delete this session and disable its users?')) return;
    await api.delete(`/admin/sessions/${id}`);
    const sRes = await api.get('/admin/sessions');
    setSessions(sRes.data);
    const uRes = await api.get('/admin/users');
    setUsers(uRes.data);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (sessionFilter !== 'all' && u.session !== sessionFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (u.userId || '').toLowerCase().includes(q) ||
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
    });
  }, [users, roleFilter, sessionFilter, search]);

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Manage Accounts</h2>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <div>
          <label style={styles.label}>Role</label>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All</option>
            <option value="student">Students</option>
            <option value="professor">Faculty</option>
          </select>
        </div>
        <div>
          <label style={styles.label}>Session</label>
          <select
            value={sessionFilter}
            onChange={e => setSessionFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All</option>
            {Array.from(new Set(users.map(u => u.session))).map(
              s =>
                s && (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
            )}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Search</label>
          <input
            style={styles.search}
            placeholder="Search by ID, name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Session list / delete */}
      <div style={styles.sessionsBox}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          Sessions overview
        </p>
        <table style={styles.sessionTable}>
          <thead>
            <tr>
              <th>Session</th>
              <th>Semester</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s._id}>
                <td>{s.session}</td>
                <td>{s.semester}</td>
                <td>{s.status}</td>
                <td>
                  {s.status === 'active' ? (
                    <span style={{ fontSize: 12, color: '#16a34a' }}>Active</span>
                  ) : (
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDeleteSession(s._id)}
                    >
                      Delete data
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Accounts table */}
      <div style={{ overflowX: 'auto', marginTop: 16 }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student / Staff ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Session</th>
              <th>Dept</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id}>
                <td>{u.userId || u.staffId || '-'}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.session}</td>
                <td>{u.department}</td>
                <td>{u.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    background: '#fff',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
  },
  title: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
  filtersRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 12,
    alignItems: 'flex-end'
  },
  label: { fontSize: 12, fontWeight: 500, color: '#4b5563', display: 'block', marginBottom: 4 },
  select: {
    padding: '6px 10px',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    fontSize: 13
  },
  search: {
    width: '100%',
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid #e5e7eb',
    fontSize: 13
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  sessionsBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    background: '#f9fafb',
    border: '1px solid #e5e7eb'
  },
  sessionTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13
  },
  deleteBtn: {
    padding: '4px 10px',
    borderRadius: 999,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    fontSize: 12,
    cursor: 'pointer'
  }
};

export default AdminManageAccounts;
