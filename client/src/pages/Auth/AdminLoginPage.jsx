
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/axios';
// import { useAuth } from '../../context/AuthContext';

// const AdminLoginPage = () => {
//   const [form, setForm] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const res = await api.post('/auth/login', {
//         ...form,
//         role: 'admin',
//         session: '2025-2026'
//       });
//       login(res.data);
//       navigate('/admin');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Admin login failed');
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.cardWrapper}>
//         <div style={styles.badge}>NSUT • Admin</div>
//         <h2 style={styles.title}>Administrator Access</h2>
//         <p style={styles.subtitle}>Secure sign-in for portal administrators</p>

//         {error && <p style={styles.error}>{error}</p>}

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Admin Email</label>
//             <input
//               style={styles.input}
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="admin@nsut.ac.in"
//             />
//           </div>

//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Password</label>
//             <input
//               style={styles.input}
//               name="password"
//               type="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//             />
//           </div>


//           <button type="submit" style={styles.button}>
//             Sign in as Admin
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   page: {
//     minHeight: '100vh',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '32px 16px',
//     background:
//       'radial-gradient(circle at top left, #1d4ed8 0, #020617 45%, #000000 100%)',
//     fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
//   },
//   cardWrapper: {
//     width: 400,
//     padding: '32px 32px 26px',
//     borderRadius: 24,
//     background:
//       'linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))',
//     boxShadow:
//       '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(148,163,184,0.18)',
//     color: '#e5e7eb',
//     backdropFilter: 'blur(20px)'
//   },
//   badge: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     gap: 6,
//     padding: '4px 10px',
//     borderRadius: 999,
//     fontSize: 11,
//     letterSpacing: '0.12em',
//     textTransform: 'uppercase',
//     background: 'rgba(37,99,235,0.16)',
//     color: '#93c5fd',
//     border: '1px solid rgba(59,130,246,0.4)',
//     marginBottom: 14
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 700,
//     margin: 0,
//     marginBottom: 4,
//     color: '#f9fafb',
//     letterSpacing: '-0.02em'
//   },
//   subtitle: {
//     fontSize: 13,
//     color: '#9ca3af',
//     margin: 0,
//     marginBottom: 24
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 16
//   },
//   inputGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 6
//   },
//   label: {
//     fontSize: 12,
//     textTransform: 'uppercase',
//     letterSpacing: '0.12em',
//     color: '#9ca3af',
//     fontWeight: 600
//   },
//   input: {
//     padding: '10px 12px',
//     borderRadius: 12,
//     border: '1px solid #1f2937',
//     background:
//       'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.9))',
//     color: '#e5e7eb',
//     fontSize: 14,
//     outline: 'none',
//     boxShadow: '0 0 0 1px rgba(15,23,42,0.8)',
//     transition: 'all 0.18s ease'
//   },
//   metaRow: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 4
//   },
//   envPill: {
//     fontSize: 11,
//     padding: '3px 9px',
//     borderRadius: 999,
//     background: 'rgba(15,23,42,0.9)',
//     border: '1px solid rgba(55,65,81,0.9)',
//     color: '#9ca3af'
//   },
//   helperText: {
//     fontSize: 11,
//     color: '#6b7280'
//   },
//   button: {
//     marginTop: 18,
//     padding: '10px 0',
//     borderRadius: 999,
//     border: 'none',
//     background:
//       'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #0ea5e9 100%)',
//     color: '#f9fafb',
//     fontWeight: 700,
//     fontSize: 14,
//     cursor: 'pointer',
//     boxShadow: '0 14px 35px rgba(37,99,235,0.65)',
//     letterSpacing: '0.06em',
//     textTransform: 'uppercase'
//   },
//   error: {
//     color: '#fca5a5',
//     marginBottom: 4,
//     fontSize: 12,
//     padding: '8px 10px',
//     borderRadius: 10,
//     background: 'rgba(127,29,29,0.25)',
//     border: '1px solid rgba(248,113,113,0.4)'
//   }
// };

// export default AdminLoginPage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const AdminLoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        ...form,
        role: "admin",
        session: "2025-2026"
      });

      login(res.data);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.cardWrapper}>
        <div style={styles.badge}>NSUT • Admin</div>

        <h2 style={styles.title}>Administrator Access</h2>
        <p style={styles.subtitle}>
          Secure sign-in for portal administrators
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin Email</label>

            <input
              style={styles.input}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@nsut.ac.in"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>

            <input
              style={styles.input}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign in as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 14px",
    background:
      "radial-gradient(circle at top left, #1d4ed8 0, #020617 45%, #000000 100%)",
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
  },

  /* ⭐ RESPONSIVE CARD */
  cardWrapper: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px 28px",
    borderRadius: 24,
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))",
    boxShadow:
      "0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(148,163,184,0.18)",
    color: "#e5e7eb",
    backdropFilter: "blur(20px)"
  },

  badge: {
    display: "inline-flex",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    background: "rgba(37,99,235,0.16)",
    color: "#93c5fd",
    border: "1px solid rgba(59,130,246,0.4)",
    marginBottom: 14
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
    color: "#f9fafb"
  },

  subtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 22
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },

  label: {
    fontSize: 12,
    letterSpacing: "0.1em",
    color: "#9ca3af",
    fontWeight: 600
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #1f2937",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.9))",
    color: "#e5e7eb",
    fontSize: 15,
    outline: "none"
  },

  button: {
    marginTop: 16,
    padding: "12px 0",
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #0ea5e9 100%)",
    color: "#f9fafb",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer"
  },

  error: {
    color: "#fca5a5",
    fontSize: 12,
    padding: "8px 10px",
    borderRadius: 10,
    background: "rgba(127,29,29,0.25)"
  }
};

export default AdminLoginPage;
