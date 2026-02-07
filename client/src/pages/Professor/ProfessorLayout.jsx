import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import nsutLogo from '../../assets/nsutlogo.png';

const ProfessorLayout = () => {
  const { user, logout } = useAuth(); // Assuming 'user' is available for name display
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Responsive listener
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={styles.app}>
      {/* Mobile Backdrop Overlay */}
      {isMobile && isMenuOpen && (
        <div style={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Responsive Sidebar */}
      <aside style={{
        ...styles.sidebar,
        transform: isMobile ? (isMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        position: isMobile ? 'fixed' : 'relative',
      }}>
        <div style={styles.logoWrapper}>
          <img src={nsutLogo} alt="NSUT" style={styles.logo} />
          <span style={styles.logoText}>Professor</span>
        </div>

        <nav style={styles.nav}>
          <NavLink to="/professor" end style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/professor/profile" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Profile
          </NavLink>
          <NavLink to="/professor/publications" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Publications
          </NavLink>

          <div style={styles.sectionLabel}>B.Tech Project</div>
          
          <NavLink to="/professor/project" end style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Overview
          </NavLink>
          
          <NavLink to="/professor/project/manage-groups" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Manage Groups
          </NavLink>

          <div style={styles.sectionLabel}>Account</div>
          <NavLink to="/professor/change-password" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Change Password
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            {isMobile && (
              <button onClick={toggleMenu} style={styles.menuBtn}>
                {isMenuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
          
          <div style={styles.headerRight}>
            {!isMobile && (
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user?.name || 'Professor'}</span>
                <span style={styles.userRole}>Faculty</span>
              </div>
            )}
            
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </header>

        <main style={{
          ...styles.content,
          padding: isMobile ? '20px' : '32px'
        }}>
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
    background: '#f8fafc', 
    fontFamily: '"Inter", sans-serif',
    overflow: 'hidden',
    position: 'relative'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 15,
  },
  sidebar: {
    width: 260,
    background: '#0f172a',
    color: '#94a3b8',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
    zIndex: 20,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    height: '100vh',
  },
  logoWrapper: {
    height: 80,
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    borderBottom: '1px solid #1e293b',
    gap: '12px'
  },
  logo: { 
    height: 40, 
    width: 40, 
    borderRadius: '10px',
    objectFit: 'contain',
    background: '#fff',
    padding: '4px'
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.01em'
  },
  nav: { 
    marginTop: '16px', 
    display: 'flex', 
    flexDirection: 'column',
    gap: '4px',
    padding: '0 12px',
    overflowY: 'auto'
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
    width: '100%',
    overflow: 'hidden' 
  },
  header: {
    height: 72,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    zIndex: 10
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  menuBtn: {
    background: '#f1f5f9',
    border: 'none',
    fontSize: '20px',
    borderRadius: '8px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#0f172a'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b'
  },
  userRole: {
    fontSize: '12px',
    color: '#64748b'
  },
  logoutBtn: {
    padding: '8px 18px',
    background: '#fee2e2',
    borderRadius: '10px',
    border: 'none',
    color: '#dc2626',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  content: {
    overflowY: 'auto',
    flex: 1,
    WebkitOverflowScrolling: 'touch'
  }
};

export default ProfessorLayout;