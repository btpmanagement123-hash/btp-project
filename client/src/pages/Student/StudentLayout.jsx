import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import nsutLogo from '../../assets/nsutlogo.png'; 

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

 
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);

    if (!user) {
      navigate('/login', { replace: true });
    } else if (user.role !== 'student') {
      navigate('/', { replace: true });
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={styles.app}>
      {/* Mobile Overlay */}
      {isMobile && isMenuOpen && (
        <div style={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Sidebar - Same logic as Admin */}
      <aside style={{
        ...styles.sidebar,
        transform: isMobile ? (isMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        position: isMobile ? 'fixed' : 'relative',
      }}>
        <div style={styles.logoWrapper}>
          <img src={nsutLogo} alt="NSUT" style={styles.logo} />
        </div>

        <nav style={styles.nav}>
          <NavLink to="/student" end style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Notifications
          </NavLink>

          <NavLink to="/student/profile" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Profile
          </NavLink>

          <div style={styles.sectionLabel}>Project Management</div>

          <NavLink to="/student/project/registration" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Registration
          </NavLink>

          <NavLink to="/student/project/overview" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Overview
          </NavLink>

          <NavLink to="/student/project/invitations" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Invitations
          </NavLink>

          <NavLink to="/student/projectadvisorbot" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Chat Bot
          </NavLink>

          <div style={styles.sectionLabel}>Account</div>
          <NavLink to="/student/change-password" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Change Password
          </NavLink>
        </nav>
      </aside>

      <div style={styles.main}>
        <header style={styles.header}>
          {isMobile && (
            <button onClick={toggleMenu} style={styles.menuBtn}>
              {isMenuOpen ? '✕' : '☰'}
            </button>
          )}
          
          <div style={styles.headerRight}>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user.name}</span>
            </div>
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
    fontFamily: '"Inter", system-ui, sans-serif',
    position: 'relative',
    overflow: 'hidden'
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
    color: '#f1f5f9',
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
    objectFit: 'contain', 
    borderRadius: '10px',
    backgroundColor: '#fff',
    padding: '4px'
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
  sectionLabel: {
    marginTop: '20px',
    marginBottom: '8px',
    padding: '0 16px',
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
    zIndex: 9
  },
  menuBtn: {
    background: '#f1f5f9',
    border: 'none',
    fontSize: '24px',
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
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b'
  },
  logoutBtn: {
    padding: '8px 16px',
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },
  content: {
    overflowY: 'auto',
    flex: 1,
    WebkitOverflowScrolling: 'touch',
  }
};

export default StudentLayout;