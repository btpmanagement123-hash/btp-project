
// // client/src/pages/Auth/LoginPage.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/axios';
// import { useAuth } from '../../context/AuthContext';
// import nsutLogo from '../../assets/nsut-logo.png';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const roles = ['Faculty', 'Student'];

//   const [selectedRole, setSelectedRole] = useState(null);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [sessionYear, setSessionYear] = useState('');
//   const [sessions, setSessions] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const loadSessions = async () => {
//       try {
//         const res = await api.get('/auth/sessions');
//         setSessions(res.data); // ['2025-2026', ...]
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     loadSessions();
//   }, []);

//   const handleRoleClick = (role) => {
//     setSelectedRole(role);
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedRole) {
//       setError('Please select Faculty or Student');
//       return;
//     }

//     try {
//       const roleForApi = selectedRole === 'Faculty' ? 'professor' : 'student';

//       const res = await api.post('/auth/login', {
//         email,
//         password,
//         role: roleForApi,
//         session: sessionYear
//       });

//       // save token + user
//       login(res.data);

//       const { role, mustChangePassword } = res.data.user;

//       if (role === 'professor') {
//         if (mustChangePassword) {
//           navigate('/professor/change-password', { replace: true });
//         } else {
//           navigate('/professor', { replace: true });
//         }
//       } else if (role === 'student') {
//         navigate('/student', { replace: true });
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   const isLoginDisabled =
//     !selectedRole ||
//     !email ||
//     !password ||
//     (selectedRole === 'Faculty' && !sessionYear);

//   return (
//     <div style={styles.page}>
//       {/* Left logo pane */}
//       <div style={styles.logoPaneLg}>
//         <img src={nsutLogo} alt="NSUT Logo" style={styles.logoLg} />
//       </div>

//       {/* Right login pane */}
//       <div style={styles.loginPane}>
//         <div style={styles.card}>
//           <div style={styles.logoSmWrapper}>
//             <img src={nsutLogo} alt="NSUT Logo" style={styles.logoSm} />
//           </div>

//           <h2 style={styles.header}>Sign In to BTP Portal</h2>

//           {/* Role buttons */}
//           <div style={styles.roleButtonsWrapper}>
//             {roles.map((r) => (
//               <button
//                 key={r}
//                 type="button"
//                 onClick={() => handleRoleClick(r)}
//                 style={{
//                   ...styles.roleButton,
//                   ...(selectedRole === r
//                     ? styles.roleButtonActive
//                     : styles.roleButtonInactive)
//                 }}
//               >
//                 {r} Login
//               </button>
//             ))}
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} style={styles.form}>
//             <input
//               type="text"
//               placeholder="Username or Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               style={styles.input}
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={styles.input}
//             />

//             {/* Faculty session dropdown */}
//             {selectedRole === 'Faculty' && (
//               <select
//                 value={sessionYear}
//                 onChange={(e) => setSessionYear(e.target.value)}
//                 style={styles.input}
//                 required
//               >
//                 <option value="">Select FY Year</option>
//                 {sessions.map((y) => (
//                   <option key={y} value={y}>
//                     {y}
//                   </option>
//                 ))}
//               </select>
//             )}

//             {error && <p style={styles.error}>{error}</p>}

//             <button
//               type="submit"
//               disabled={isLoginDisabled}
//               style={{
//                 ...styles.loginButtonBase,
//                 ...(isLoginDisabled
//                   ? styles.loginButtonDisabled
//                   : styles.loginButtonActive)
//               }}
//             >
//               Login
//             </button>
//           </form>

//           <p style={styles.footer}>© 2025 BTP Portal. All rights reserved.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   page: {
//     display: 'flex',
//     height: '100vh',
//     width: '100vw',
//     fontFamily:
//       'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
//   },
//   logoPaneLg: {
//     flexBasis: '33.3333%',
//     minWidth: '300px',
//     backgroundColor: '#1f2937',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '48px'
//   },
//   logoLg: {
//     maxHeight: '100%',
//     maxWidth: '100%',
//     objectFit: 'contain'
//   },
//   loginPane: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '32px 24px'
//   },
//   card: {
//     width: '100%',
//     maxWidth: '420px',
//     backgroundColor: '#ffffff',
//     borderRadius: '16px',
//     padding: '32px 24px',
//     boxShadow:
//       '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '24px'
//   },
//   header: {
//     fontSize: '24px',
//     fontWeight: '700',
//     textAlign: 'center',
//     color: '#111827',
//     margin: 0
//   },
//   logoSmWrapper: {
//     display: 'flex',
//     justifyContent: 'center',
//     marginBottom: '16px'
//   },
//   logoSm: {
//     width: '96px',
//     height: 'auto',
//     objectFit: 'contain'
//   },
//   roleButtonsWrapper: {
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '16px',
//     flexWrap: 'wrap'
//   },
//   roleButton: {
//     padding: '8px 16px',
//     borderRadius: '12px',
//     border: 'none',
//     fontWeight: '500',
//     fontSize: '14px',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease-in-out',
//     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//   },
//   roleButtonActive: {
//     backgroundColor: '#4f46e5',
//     color: '#ffffff',
//     boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.5)',
//     transform: 'scale(1.05)'
//   },
//   roleButtonInactive: {
//     backgroundColor: '#f3f4f6',
//     color: '#4b5563'
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px'
//   },
//   input: {
//     width: '100%',
//     padding: '12px 16px',
//     borderRadius: '12px',
//     backgroundColor: '#ffffff',
//     border: '1px solid #d1d5db',
//     fontSize: '16px',
//     color: '#1f2937',
//     fontWeight: '500',
//     outline: 'none',
//     boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//     transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
//   },
//   error: {
//     fontSize: '14px',
//     color: '#dc2626',
//     marginTop: '-8px',
//     marginBottom: 0
//   },
//   loginButtonBase: {
//     width: '100%',
//     padding: '12px 16px',
//     borderRadius: '12px',
//     border: 'none',
//     fontSize: '18px',
//     fontWeight: '600',
//     transition: 'all 0.2s ease-in-out'
//   },
//   loginButtonActive: {
//     backgroundColor: '#4f46e5',
//     color: '#ffffff',
//     cursor: 'pointer',
//     boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)'
//   },
//   loginButtonDisabled: {
//     backgroundColor: '#e5e7eb',
//     color: '#9ca3af',
//     cursor: 'not-allowed',
//     boxShadow: 'none'
//   },
//   footer: {
//     marginTop: 4,
//     fontSize: '12px',
//     textAlign: 'center',
//     color: '#9ca3af'
//   }
// };

// export default LoginPage;
// client/src/pages/Auth/LoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import nsutLogo from "../../assets/nsut-logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const roles = ["Faculty", "Student"];

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sessionYear, setSessionYear] = useState("");
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.get("/auth/sessions");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadSessions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setError("Please select Faculty or Student");
      return;
    }

    try {
      const roleForApi =
        selectedRole === "Faculty" ? "professor" : "student";

      const res = await api.post("/auth/login", {
        email,
        password,
        role: roleForApi,
        session: sessionYear,
      });

      login(res.data);

      const { role, mustChangePassword } = res.data.user;

      if (role === "professor") {
        if (mustChangePassword)
          navigate("/professor/change-password");
        else navigate("/professor");
      } else navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const isLoginDisabled =
    !selectedRole ||
    !email ||
    !password ||
    (selectedRole === "Faculty" && !sessionYear);

  return (
    <div className="login-page">

      {/* LEFT LOGO SECTION */}
      <div className="logo-section">
        <img src={nsutLogo} alt="NSUT Logo" />
      </div>

      {/* RIGHT LOGIN SECTION */}
      <div className="form-section">
        <div className="card">

          <img src={nsutLogo} className="logo-small" alt="logo" />

          <h2>Sign In to BTP Portal</h2>

          {/* Role buttons */}
          <div className="role-wrapper">
            {roles.map((r) => (
              <button
                key={r}
                className={`role-btn ${
                  selectedRole === r ? "active" : ""
                }`}
                onClick={() => setSelectedRole(r)}
              >
                {r} Login
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD WITH EYE ICON */}
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Faculty Session */}
            {selectedRole === "Faculty" && (
              <select
                value={sessionYear}
                onChange={(e) => setSessionYear(e.target.value)}
                required
              >
                <option value="">Select FY Year</option>
                {sessions.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            )}

            {error && <p className="error">{error}</p>}

            <button
              disabled={isLoginDisabled}
              className="login-btn"
            >
              Login
            </button>
          </form>

          <p className="footer">
            © 2025 BTP Portal. All rights reserved.
          </p>
        </div>
      </div>

      {/* ================= CSS ================= */}
      <style>{`

/* ===== MAIN PAGE ===== */
.login-page{
  display:flex;
  min-height:100vh;
  font-family: "Segoe UI", sans-serif;
  background:#020617;
}


/* ===== LEFT LOGO PANEL ===== */
.logo-section{
  flex:1.1;
  background:linear-gradient(135deg,#020617,#0f172a);
  display:flex;
  justify-content:center;
  align-items:center;
  padding:40px;
  border-right:1px solid rgba(255,255,255,0.05);
}

.logo-section img{
  width:90%;
  max-width:520px;
  object-fit:contain;
  filter: drop-shadow(0px 0px 30px rgba(255,0,0,0.4));
}


/* ===== RIGHT FORM PANEL ===== */
.form-section{
  flex:1;
  background:linear-gradient(180deg,#f8fafc,#e2e8f0);
  display:flex;
  justify-content:center;
  align-items:center;
  padding:50px;
}


/* ===== LOGIN CARD ===== */
.card{
  width:100%;
  max-width:520px;
  background:rgba(255,255,255,0.85);
  backdrop-filter: blur(14px);
  padding:42px;
  border-radius:24px;
  box-shadow:
    0 25px 70px rgba(0,0,0,0.2);
  display:flex;
  flex-direction:column;
  gap:22px;
  transition:0.3s;
}

.card:hover{
  transform:translateY(-4px);
}


/* ===== SMALL LOGO ===== */
.logo-small{
  width:75px;
  margin:auto;
}


/* ===== HEADER ===== */
h2{
  text-align:center;
  font-weight:600;
  color:#0f172a;
  letter-spacing:0.3px;
}


/* ===== ROLE BUTTONS ===== */
.role-wrapper{
  display:flex;
  justify-content:center;
  gap:14px;
}

.role-btn{
  padding:9px 20px;
  border:none;
  border-radius:25px;
  background:#e2e8f0;
  font-weight:500;
  cursor:pointer;
  transition:0.25s;
}

.role-btn:hover{
  background:#cbd5e1;
}

.role-btn.active{
  background:#ef4444;
  color:white;
  box-shadow:0 8px 20px rgba(239,68,68,0.4);
}


/* ===== FORM ===== */
form{
  display:flex;
  flex-direction:column;
  gap:18px;
}


/* ===== INPUT ===== */
input, select{
  padding:15px;
  border-radius:14px;
  border:1px solid #cbd5e1;
  font-size:16px;
  background:white;
  transition:0.2s;
}

input:focus, select:focus{
  border-color:#ef4444;
  box-shadow:0 0 0 2px rgba(239,68,68,0.15);
  outline:none;
}


/* ===== PASSWORD ===== */
.password-wrapper{
  position:relative;
}

.eye-icon{
  position:absolute;
  right:14px;
  top:50%;
  transform:translateY(-50%);
  cursor:pointer;
  color:#64748b;
  font-size:18px;
}


/* ===== LOGIN BUTTON ===== */
.login-btn{
  width:100%;
  padding:15px;
  border:none;
  border-radius:14px;
  font-weight:600;
  font-size:17px;
  background:linear-gradient(135deg,#ef4444,#dc2626);
  color:white;
  cursor:pointer;
  transition:0.3s;
}

.login-btn:hover{
  transform:translateY(-1px);
  box-shadow:0 10px 25px rgba(220,38,38,0.4);
}

.login-btn:disabled{
  background:#cbd5e1;
  cursor:not-allowed;
  box-shadow:none;
}


/* ===== ERROR ===== */
.error{
  color:#dc2626;
  font-size:14px;
  text-align:center;
}


/* ===== FOOTER ===== */
.footer{
  text-align:center;
  font-size:12px;
  color:#64748b;
}


/* ===== MOBILE RESPONSIVE ===== */
@media(max-width:900px){

  .login-page{
    flex-direction:column;
  }

  .logo-section{
    height:220px;
  }

  .logo-section img{
    width:220px;
  }

  .form-section{
    padding:30px 18px;
  }

  .card{
    padding:32px;
  }

}

`}</style>

    </div>
  );
};

export default LoginPage;
