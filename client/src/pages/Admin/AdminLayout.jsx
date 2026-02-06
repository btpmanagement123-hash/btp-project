import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import nsutLogo from '../../assets/nsutlogo.png';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logoWrapper}>
          <img src={nsutLogo} alt="NSUT" style={styles.logo} />
        </div>
        <nav style={styles.nav}>
          <NavLink to="/admin/accounts" style={styles.navItem}>
            Accounts Centre
          </NavLink>
          <NavLink to="/admin/settings" style={styles.navItem}>
            Settings and Setup
          </NavLink><NavLink to="/admin/notifications" style={styles.navItem}>
    Notifications
  </NavLink>

          
        </nav>
      </aside>

      <div style={styles.main}>
        <header style={styles.header}>
         
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
    background: '#f8fafc', // Slightly cooler light gray
    fontFamily: '"Inter", system-ui, sans-serif'
  },
  sidebar: {
    width: 260, // Widened slightly for better text breathing room
    background: '#0f172a', // Deep Slate 900
    color: '#f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
    zIndex: 10
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
    objectFit: 'contain', 
    borderRadius: '12px', // Modern squircle look
    backgroundColor: '#fff',
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
    color: isActive ? '#fff' : '#94a3b8',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '500',
    textDecoration: 'none',
    borderRadius: '8px',
    background: isActive ? '#1e293b' : 'transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  }),
  main: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden' 
  },
  header: {
    height: 72,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)', // Modern glass effect
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end', // Aligned to end since search was removed
    padding: '0 32px',
    zIndex: 9
  },
  logoutBtn: {
    padding: '10px 20px',
    background: '#fee2e2', // Light red background
    color: '#dc2626', // Bold red text
    borderRadius: '10px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },
  content: {
    padding: '32px',
    overflowY: 'auto',
    flex: 1
  }
};

export default AdminLayout;
