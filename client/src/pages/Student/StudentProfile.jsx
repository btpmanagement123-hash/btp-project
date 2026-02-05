// import { useEffect, useState } from 'react';
// import api from '../../api/axios';

// const StudentProfile = () => {
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await api.get('/student/me');
//         setStudent(res.data);
//       } catch (err) {
//         console.error('student me error', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (!student) return <p>Could not load profile.</p>;

//   return (
//     <div>
//       <h2 style={styles.name}>{student.name}</h2>
//       <p style={styles.subTitle}>
//         {student.department || 'Department'} · {student.session || 'Session'}
//       </p>

//       <div style={styles.grid}>
//         <div style={styles.card}>
//           <h3 style={styles.cardTitle}>Academic Details</h3>
//           <div style={styles.row}>
//             <span style={styles.label}>Roll Number</span>
//             <span style={styles.value}>{student.userId || '-'}</span>
//           </div>
//           <div style={styles.row}>
//             <span style={styles.label}>Section</span>
//             <span style={styles.value}>{student.section || '-'}</span>
//           </div>
//           <div style={styles.row}>
//             <span style={styles.label}>Current Semester</span>
//             <span style={styles.value}>{student.semester || '-'}</span>
//           </div>
//         </div>

//         <div style={styles.card}>
//           <h3 style={styles.cardTitle}>Contact & Status</h3>
//           <div style={styles.row}>
//             <span style={styles.label}>Official Email</span>
//             <span style={styles.value}>{student.email}</span>
//           </div>
//           <div style={styles.row}>
//             <span style={styles.label}>Phone</span>
//             <span style={styles.value}>{student.mobile || '-'}</span>
//           </div>
//           <div style={styles.row}>
//             <span style={styles.label}>Account Status</span>
//             <span
//               style={{
//                 ...styles.badge,
//                 background: student.isActive ? '#dcfce7' : '#fee2e2',
//                 color: student.isActive ? '#16a34a' : '#b91c1c'
//               }}
//             >
//               {student.isActive ? 'Active' : 'Inactive'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   name: { fontSize: 24, fontWeight: 700 },
//   subTitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: 'minmax(0,2fr) minmax(0,2fr)',
//     gap: 16
//   },
//   card: {
//     background: '#ffffff',
//     borderRadius: 18,
//     padding: 18,
//     boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
//   },
//   cardTitle: { fontSize: 15, fontWeight: 600, marginBottom: 10 },
//   row: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     fontSize: 13,
//     padding: '6px 0',
//     borderBottom: '1px dashed #e5e7eb'
//   },
//   label: { color: '#6b7280' },
//   value: { fontWeight: 500, color: '#111827' },
//   badge: {
//     padding: '2px 8px',
//     borderRadius: 999,
//     fontSize: 11,
//     fontWeight: 600
//   }
// };

// export default StudentProfile;
import { useEffect, useState } from "react";
import api from "../../api/axios";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/student/me");
        setStudent(res.data);
      } catch (err) {
        console.error("student me error", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (!student) return <p style={styles.loading}>Could not load profile.</p>;

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.name}>{student.name}</h2>

      <p style={styles.subTitle}>
        {student.department || "Department"} ·{" "}
        {student.session || "Session"}
      </p>

      <div style={styles.grid}>
        {/* Academic Details */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Academic Details</h3>

          <InfoRow label="Roll Number" value={student.userId} />
          <InfoRow label="Current Semester" value={student.semester} />
        </div>

        {/* Contact Details */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Contact & Status</h3>

          <InfoRow label="Official Email" value={student.email} />
          <InfoRow label="Phone" value={student.mobile} />

          <div style={styles.row}>
            <span style={styles.label}>Account Status</span>
            <span
              style={{
                ...styles.badge,
                background: student.isActive ? "#dcfce7" : "#fee2e2",
                color: student.isActive ? "#16a34a" : "#b91c1c"
              }}
            >
              {student.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Row */
const InfoRow = ({ label, value }) => (
  <div style={styles.row}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value || "-"}</span>
  </div>
);

const styles = {
  wrapper: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 16
  },

  loading: {
    padding: 20,
    textAlign: "center"
  },

  name: {
    fontSize: 24,
    fontWeight: 700
  },

  subTitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 18
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))",
    gap: 16
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 12
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    fontSize: 13,
    padding: "8px 0",
    borderBottom: "1px dashed #e5e7eb"
  },

  label: {
    color: "#6b7280"
  },

  value: {
    fontWeight: 500,
    color: "#111827",
    wordBreak: "break-word"
  },

  badge: {
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600
  }
};

export default StudentProfile;
