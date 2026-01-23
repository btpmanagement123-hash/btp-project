import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import nsutLogo from '../../assets/nsut-logo.png';

const ProfessorLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logoWrapper}>
          <img src={nsutLogo} alt="NSUT" style={styles.logo} />
        </div>
        <nav style={styles.nav}>
  <NavLink to="/professor" end style={styles.navItem}>
    Dashboard
  </NavLink>
  <NavLink to="/professor/profile" style={styles.navItem}>
    Profile
  </NavLink>
  <NavLink to="/professor/publications" style={styles.navItem}>
    Publications
  </NavLink>
  <div style={styles.sectionLabel}>B.Tech Project</div>
  <NavLink to="/professor/project" style={styles.navItem}>
    Overview
  </NavLink>
  <NavLink to="/professor/project/manage-groups" style={styles.navItem}>
    Manage Groups
  </NavLink>
  <NavLink to="/professor/change-password" style={styles.navItem}>
    Change Password
  </NavLink>
</nav>

      </aside>

      <div style={styles.main}>
        <header style={styles.header}>
          <div />
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </header>
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  app: { display: 'flex', minHeight: '100vh', background: '#f3f4f6' },
  sidebar: {
    width: 230,
    background: '#020617',
    color: '#e5e7eb',
    display: 'flex',
    flexDirection: 'column'
  },
  logoWrapper: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #111827'
  },
  logo: { height: 44, width: 44, borderRadius: '50%' },
  nav: { marginTop: 8, display: 'flex', flexDirection: 'column' },
  navItem: ({ isActive }) => ({
    padding: '10px 18px',
    color: '#e5e7eb',
    fontSize: 14,
    textDecoration: 'none',
    background: isActive ? '#111827' : 'transparent'
  }),
  sectionLabel: {
    padding: '8px 18px 4px',
    fontSize: 11,
    textTransform: 'uppercase',
    color: '#6b7280'
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: {
    height: 64,
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px'
  },
  logoutBtn: {
    padding: '8px 18px',
    background: '#ef4444',
    borderRadius: 999,
    border: 'none',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  },
  content: {
    padding: '20px 24px 32px',
    overflowY: 'auto'
  }
};

export default ProfessorLayout;
