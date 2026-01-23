import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>NSUT</div>

        <nav style={styles.nav}>
          <NavLink to="/student" end style={styles.navItem}>
            Notifications
          </NavLink>
          <NavLink to="/student/profile" style={styles.navItem}>
            Profile
          </NavLink>

          <div style={styles.sectionLabel}>Project</div>
          <NavLink to="/student/project/registration" style={styles.navItem}>
            Registration
          </NavLink>
          <NavLink to="/student/project/overview" style={styles.navItem}>
            Project Overview
          </NavLink>

          <NavLink to="/student/change-password" style={styles.navItem}>
            Change Password
          </NavLink>
          <NavLink to="/student/project/invitations" style={styles.navItem}>
  Group Invitations
</NavLink>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </header>
        <section style={styles.content}>
          <Outlet />
        </section>
      </main>
    </div>
  );
};

const styles = {
  page: { display: 'flex', height: '100vh', background: '#f3f4f6' },
  sidebar: {
    width: 220,
    background: '#050816',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: 16
  },
  logo: { fontWeight: 700, marginBottom: 24 },
  nav: { display: 'flex', flexDirection: 'column', gap: 8 },
  navItem: ({ isActive }) => ({
    padding: '8px 10px',
    borderRadius: 8,
    color: '#e5e7eb',
    textDecoration: 'none',
    background: isActive ? '#111827' : 'transparent',
    fontSize: 14
  }),
  sectionLabel: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.08,
    color: '#9ca3af'
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: {
    height: 56,
    background: '#ffffff',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0 24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  logoutBtn: {
    padding: '6px 14px',
    borderRadius: 999,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    fontSize: 13,
    cursor: 'pointer'
  },
  content: { flex: 1, padding: 24, overflowY: 'auto' }
};

export default StudentLayout;
