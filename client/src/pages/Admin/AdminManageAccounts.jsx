
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
      <h2 style={styles.title}>Accounts Information</h2>

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
    background: '#ffffff',
    borderRadius: '20px',
    padding: 'clamp(16px, 5vw, 32px)', // Scales padding based on screen size
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    margin: '10px',
    maxWidth: '100%',
    overflowX: 'hidden' // Prevents horizontal scroll on the main container
  },
  title: { 
    fontSize: 'clamp(18px, 4vw, 22px)', 
    fontWeight: '700', 
    marginBottom: '24px', 
    color: '#0f172a',
    letterSpacing: '-0.02em'
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap', // Key for responsiveness: wraps items to next line
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'flex-end',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px'
  },
  filterItem: {
    flex: '1 1 200px', // Allows items to grow and shrink, but stay around 200px
    minWidth: '0'     // Prevents flex items from overflowing
  },
  label: { 
    fontSize: '12px', 
    fontWeight: '600', 
    color: '#64748b', 
    display: 'block', 
    marginBottom: '6px',
    textTransform: 'uppercase'
  },
  select: {
    width: '100%', // Take up the full width of the filterItem container
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    color: '#334155',
    background: '#fff',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none' // Better mobile rendering
  },
  search: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  // Table Container (Essential for mobile)
  tableWrapper: {
    width: '100%',
    overflowX: 'auto', // Adds horizontal scroll only for the table on small screens
    WebkitOverflowScrolling: 'touch'
  },
  table: { 
    width: '100%', 
    minWidth: '600px', // Ensures table doesn't get squashed too thin
    borderCollapse: 'separate', 
    borderSpacing: '0 8px',
    fontSize: '14px' 
  },
  sessionsBox: {
    marginTop: '20px',
    padding: 'clamp(12px, 3vw, 20px)',
    borderRadius: '16px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  sessionTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    textAlign: 'left'
  },
  deleteBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    background: '#fef2f2',
    color: '#dc2626',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap' // Keeps text on one line
  }
};

export default AdminManageAccounts;
