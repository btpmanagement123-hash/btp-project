import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import nsutLogo from '../../assets/nsutlogo.png';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
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
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
  await logout();
  navigate('/admin123', { replace: true });
};

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={styles.app}>
      {/* Mobile Overlay */}
      {isMobile && isMenuOpen && (
        <div style={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        transform: isMobile ? (isMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        position: isMobile ? 'fixed' : 'relative',
      }}>
        <div style={styles.logoWrapper}>
          <img src={nsutLogo} alt="NSUT" style={styles.logo} />
          <span style={styles.logoText}>Admin Panel</span>
        </div>
        <nav style={styles.nav}>
          <NavLink to="/admin/accounts" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Accounts Centre
          </NavLink>
          <NavLink to="/admin/settings" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Settings and Setup
          </NavLink>
          <NavLink to="/admin/notifications" style={styles.navItem} onClick={() => setIsMenuOpen(false)}>
            Notifications
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
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff'
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
    justifyContent: 'space-between', // Changed to accommodate menu button
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
    justifyContent: 'flex-end'
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
    WebkitOverflowScrolling: 'touch', // Smooth scrolling for iOS
  }
};

export default AdminLayout;