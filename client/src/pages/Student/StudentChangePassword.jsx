// // client/src/pages/Student/StudentChangePassword.jsx
// import { useState } from 'react';
// import api from '../../api/axios';

// const StudentChangePassword = () => {
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMsg('');
//     setError('');
//     try {
//       await api.post('/auth/change-password', {
//         oldPassword,
//         newPassword
//       });
//       setMsg('Password updated successfully.');
//       setOldPassword('');
//       setNewPassword('');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to change password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2 style={styles.title}>Change Password</h2>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <input
//           type="password"
//           placeholder="Current password"
//           value={oldPassword}
//           onChange={(e) => setOldPassword(e.target.value)}
//           style={styles.input}
//         />
//         <input
//           type="password"
//           placeholder="New password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           style={styles.input}
//         />
//         {error && <p style={styles.error}>{error}</p>}
//         {msg && <p style={styles.success}>{msg}</p>}
//         <button type="submit" disabled={loading} style={styles.btn}>
//           {loading ? 'Updating...' : 'Update Password'}
//         </button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   title: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
//   form: { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 },
//   input: {
//     padding: '10px 12px',
//     borderRadius: 10,
//     border: '1px solid #d1d5db',
//     fontSize: 14
//   },
//   btn: {
//     marginTop: 4,
//     padding: '10px 0',
//     borderRadius: 10,
//     border: 'none',
//     background: '#4f46e5',
//     color: '#fff',
//     fontWeight: 600,
//     cursor: 'pointer'
//   },
//   error: { fontSize: 13, color: '#dc2626' },
//   success: { fontSize: 13, color: '#16a34a' }
// };

// export default StudentChangePassword;
import { useState } from "react";
import api from "../../api/axios";

const StudentChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");
    setError("");

    try {
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword
      });

      setMsg("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Change Password</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}
          {msg && <p style={styles.success}>{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            style={styles.btn}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "16px",
    maxWidth: 420,
    margin: "0 auto"
  },

  card: {
    background: "#ffffff",
    borderRadius: 18,
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 16,
    textAlign: "center"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14
  },

  btn: {
    marginTop: 6,
    padding: "10px",
    borderRadius: 10,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%"
  },

  error: {
    fontSize: 13,
    color: "#dc2626",
    textAlign: "center"
  },

  success: {
    fontSize: 13,
    color: "#16a34a",
    textAlign: "center"
  }
};

export default StudentChangePassword;
