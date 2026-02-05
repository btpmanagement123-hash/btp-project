// // client/src/pages/Admin/AdminSettingsHome.jsx
// import { useNavigate } from 'react-router-dom';

// const AdminSettingsHome = () => {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <h2 style={styles.title}>System Configuration</h2>
//       <div style={styles.grid}>
//         <div style={styles.card} onClick={() => navigate('/admin/settings/create-session')}>
//           <div style={styles.icon}>📅</div>
//           <h3 style={styles.cardTitle}>Create Academic Session</h3>
//           <p style={styles.cardText}>
//             Define academic year and semester date ranges.
//           </p>
//         </div>
//         <div style={styles.card} onClick={() => navigate('/admin/settings/btp-config')}>
//           <div style={styles.icon}>📄</div>
//           <h3 style={styles.cardTitle}>BTP Configurations</h3>
//           <p style={styles.cardText}>
//             Configure group size, supervisors and registration deadline.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   title: { fontSize: 22, fontWeight: 600, marginBottom: 18 },
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
//     gap: 20
//   },
//   card: {
//     background: '#ffffff',
//     borderRadius: 18,
//     padding: '20px 22px',
//     boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
//     cursor: 'pointer'
//   },
//   icon: { fontSize: 30, marginBottom: 8 },
//   cardTitle: { fontSize: 16, fontWeight: 600, marginBottom: 6 },
//   cardText: { fontSize: 13, color: '#6b7280' }
// };

// export default AdminSettingsHome;
import { useNavigate } from "react-router-dom";

const AdminSettingsHome = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>System Configuration</h2>

      <div style={styles.grid}>
        <div
          style={styles.card}
          onClick={() =>
            navigate("/admin/settings/create-session")
          }
        >
          <div style={styles.icon}>📅</div>

          <h3 style={styles.cardTitle}>
            Create Academic Session
          </h3>

          <p style={styles.cardText}>
            Define academic year and semester date ranges.
          </p>
        </div>

        <div
          style={styles.card}
          onClick={() =>
            navigate("/admin/settings/btp-config")
          }
        >
          <div style={styles.icon}>📄</div>

          <h3 style={styles.cardTitle}>BTP Configurations</h3>

          <p style={styles.cardText}>
            Configure group size, supervisors and registration
            deadline.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto"
  },

  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 20
  },

  /* ⭐ RESPONSIVE GRID */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
    gap: 20
  },

  card: {
    background: "#ffffff",
    borderRadius: 18,
    padding: "22px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    cursor: "pointer",
    transition: "0.25s"
  },

  icon: {
    fontSize: 32,
    marginBottom: 10
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 6
  },

  cardText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 1.4
  }
};

export default AdminSettingsHome;
