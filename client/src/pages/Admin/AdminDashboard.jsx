import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>
      <button onClick={logout}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Users ({users.length})</h3>
      <ul>
        {users.map(u => (
          <li key={u._id}>{u.role} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
