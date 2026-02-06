import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import nsutLogo from '../../assets/nsutlogo.png';

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
            
            {/* Add the 'end' prop here */}
            <NavLink to="/professor/project" end style={styles.navItem}>
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
  app: { 
    display: 'flex', 
    minHeight: '100vh', 
    background: '#f8fafc', // Softer gray background
    fontFamily: '"Inter", sans-serif'
  },
  sidebar: {
    width: 260, // Slightly wider for better breathing room
    background: '#0f172a', // Deep navy/slate
    color: '#94a3b8',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 10px rgba(0,0,0,0.02)'
  },
  logoWrapper: {
    height: 80,
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    borderBottom: '1px solid #1e293b'
  },
  logo: { 
    height: 48, 
    width: 48, 
    borderRadius: '12px', // Modern squircle
    objectFit: 'contain',
    background: '#fff',
    padding: '4px'
  },
  nav: { 
    marginTop: '16px', 
    display: 'flex', 
    flexDirection: 'column',
    gap: '4px',
    padding: '0 12px'
  },
  navItem: ({ isActive }) => ({
    padding: '12px 16px',
    color: isActive ? '#ffffff' : '#94a3b8',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '500',
    textDecoration: 'none',
    borderRadius: '10px',
    background: isActive ? '#1e293b' : 'transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center'
  }),
  sectionLabel: {
    padding: '24px 16px 8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#475569'
  },
  main: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden' 
  },
  header: {
    height: 70,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)', // Glassmorphism effect
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    zIndex: 10
  },
  logoutBtn: {
    padding: '8px 20px',
    background: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  content: {
    padding: '32px',
    overflowY: 'auto',
    flex: 1
  }
};

export default ProfessorLayout;
