// // src/pages/Admin/AdminLayout.jsx
// import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// import nsutLogo from '../../assets/nsut-logo.png';
// import { useAuth } from '../../context/AuthContext';

// const AdminLayout = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div style={styles.app}>
//       <aside style={styles.sidebar}>
//         <div style={styles.logoWrapper}>
//           <img src={nsutLogo} alt="NSUT" style={styles.logo} />
//         </div>
//         <nav style={styles.nav}>
//           <NavLink to="/admin/accounts" style={styles.navItem}>
//             Accounts Centre
//           </NavLink>
//           <NavLink to="/admin/settings" style={styles.navItem}>
//             Settings and Setup
//           </NavLink><NavLink to="/admin/notifications" style={styles.navItem}>
//     Notifications
//   </NavLink>

          
//         </nav>
//       </aside>

//       <div style={styles.main}>
//         <header style={styles.header}>
         
//           <button onClick={handleLogout} style={styles.logoutBtn}>
//             Logout
//           </button>
//         </header>
//         <main style={styles.content}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   app: { display: 'flex', minHeight: '100vh', background: '#f3f4f6' },
//   sidebar: {
//     width: 220,
//     background: '#020617',
//     color: '#e5e7eb',
//     display: 'flex',
//     flexDirection: 'column'
//   },
//   logoWrapper: {
//     height: 64,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderBottom: '1px solid #111827'
//   },
//   logo: { height: 44, width: 44, objectFit: 'contain', borderRadius: '50%' },
//   nav: { marginTop: 8, display: 'flex', flexDirection: 'column' },
//   navItem: ({ isActive }) => ({
//     padding: '10px 18px',
//     color: '#e5e7eb',
//     fontSize: 14,
//     textDecoration: 'none',
//     background: isActive ? '#111827' : 'transparent'
//   }),
//   main: { flex: 1, display: 'flex', flexDirection: 'column' },
//   header: {
//     height: 64,
//     background: '#ffffff',
//     borderBottom: '1px solid #e5e7eb',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '0 24px'
//   },
//   search: {
//     flex: 1,
//     maxWidth: 500,
//     padding: '8px 12px',
//     borderRadius: 999,
//     border: '1px solid #e5e7eb',
//     fontSize: 14
//   },
//   logoutBtn: {
//     marginLeft: 16,
//     padding: '8px 18px',
//     background: '#ef4444',
//     borderRadius: 999,
//     border: 'none',
//     color: '#fff',
//     fontWeight: 600,
//     cursor: 'pointer'
//   },
//   content: {
//     padding: '20px 24px 32px',
//     overflowY: 'auto'
//   }
// };

// export default AdminLayout;
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import nsutLogo from "../../assets/nsut-logo.png";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.app}>
      {/* OVERLAY FOR MOBILE */}
      {sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          ...(sidebarOpen ? styles.sidebarMobileOpen : {})
        }}
      >
        <div style={styles.logoWrapper}>
          <img src={nsutLogo} style={styles.logo} alt="logo" />
        </div>

        <nav style={styles.nav}>
          <NavLink
            to="/admin/accounts"
            style={styles.navItem}
            onClick={() => setSidebarOpen(false)}
          >
            Accounts Centre
          </NavLink>

          <NavLink
            to="/admin/settings"
            style={styles.navItem}
            onClick={() => setSidebarOpen(false)}
          >
            Settings and Setup
          </NavLink>

          <NavLink
            to="/admin/notifications"
            style={styles.navItem}
            onClick={() => setSidebarOpen(false)}
          >
            Notifications
          </NavLink>
        </nav>
      </aside>

      {/* MAIN SECTION */}
      <div style={styles.main}>
        <header style={styles.header}>
          {/* HAMBURGER BUTTON */}
          <button
            style={styles.menuBtn}
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <button style={styles.logoutBtn} onClick={handleLogout}>
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
    display: "flex",
    minHeight: "100vh",
    background: "#f3f4f6"
  },

  /* SIDEBAR */
  sidebar: {
    width: 220,
    background: "#020617",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",

    /* MOBILE DEFAULT HIDDEN */
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    transform: "translateX(-100%)",
    transition: "0.3s",
    zIndex: 1000
  },

  sidebarMobileOpen: {
    transform: "translateX(0)"
  },

  logoWrapper: {
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #111827"
  },

  logo: {
    height: 44,
    width: 44,
    borderRadius: "50%"
  },

  nav: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column"
  },

  navItem: ({ isActive }) => ({
    padding: "12px 18px",
    color: "#e5e7eb",
    textDecoration: "none",
    background: isActive ? "#111827" : "transparent"
  }),

  /* MAIN */
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },

  header: {
    height: 64,
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px"
  },

  /* MOBILE MENU BUTTON */
  menuBtn: {
    fontSize: 22,
    background: "transparent",
    border: "none",
    cursor: "pointer"
  },

  logoutBtn: {
    padding: "8px 18px",
    background: "#ef4444",
    borderRadius: 999,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer"
  },

  content: {
    padding: "20px",
    overflowY: "auto"
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 999
  }
};

export default AdminLayout;
