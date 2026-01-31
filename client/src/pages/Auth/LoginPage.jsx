// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import api from '../../api/axios';
// // import { useAuth } from '../../context/AuthContext';
// // import nsutLogo from '../../assets/nsut-logo.png';

// // const sessionYears = ['2025-2026', '2024-2025', '2023-2024', '2022-2023'];

// // const LoginPage = () => {
// //   const navigate = useNavigate();
// //   const { login } = useAuth();

// //   const roles = ['Faculty', 'Student'];

// //   const [selectedRole, setSelectedRole] = useState(null);
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [sessionYear, setSessionYear] = useState('');
// //   const [error, setError] = useState('');

// //   const handleRoleClick = (role) => {
// //     setSelectedRole(role);
// //     setError('');
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!selectedRole) {
// //       setError('Please select Faculty or Student');
// //       return;
// //     }

// //     try {
// //       const roleForApi = selectedRole === 'Faculty' ? 'professor' : 'student';

// //       const res = await api.post('/auth/login', {
// //         email,
// //         password,
// //         role: roleForApi,
// //         session: sessionYear || '2025-2026'
// //       });

// //       login(res.data);

// //       const { role, mustChangePassword } = res.data.user;

// //       if (mustChangePassword) {
// //         navigate('/change-password');
// //       } else if (role === 'professor') {
// //         navigate('/professor');
// //       } else if (role === 'student') {
// //         navigate('/student');
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Login failed');
// //     }
// //   };

// //   return (
// //     <div style={styles.page}>
// //       {/* Left: Full height hero section with logo */}
// //       <div style={styles.heroPane}>
// //         <div style={styles.heroContent}>
// //           <div style={styles.logoContainer}>
// //             <img src={nsutLogo} alt="NSUT Logo" style={styles.heroLogo} />
// //           </div>
// //           <div style={styles.heroText}>
// //             <h1 style={styles.heroTitle}>Netaji Subhas University</h1>
// //             <h1 style={styles.heroTitle}>of Technology</h1>
// //             <p style={styles.heroSubtitle}>BTP Portal</p>
// //           </div>
// //         </div>
// //         <div style={styles.heroGradient}></div>
// //       </div>

// //       {/* Right: Login form */}
// //       <div style={styles.loginPane}>
// //         <div style={styles.card}>
// //           <div style={styles.header}>
// //             <h2 style={styles.welcomeTitle}>Welcome Back</h2>
// //             <p style={styles.welcomeSubtitle}>Please sign in to your account</p>
// //           </div>

// //           {/* Role selection */}
// //           <div style={styles.roleSection}>
// //             <p style={styles.roleLabel}>Login as:</p>
// //             <div style={styles.roleButtonsWrapper}>
// //               {roles.map((r) => (
// //                 <button
// //                   key={r}
// //                   type="button"
// //                   onClick={() => handleRoleClick(r)}
// //                   style={{
// //                     ...styles.roleButton,
// //                     ...(selectedRole === r ? styles.roleButtonActive : {})
// //                   }}
// //                 >
// //                   <span style={styles.roleIcon}>
// //                     {r === 'Faculty' ? '👨‍🏫' : '👨‍🎓'}
// //                   </span>
// //                   {r}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Form */}
// //           <form onSubmit={handleSubmit} style={styles.form}>
// //             <div style={styles.inputGroup}>
// //               <label style={styles.label}>Email</label>
// //               <input
// //                 placeholder="Enter your email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 style={styles.input}
// //               />
// //             </div>

// //             <div style={styles.inputGroup}>
// //               <label style={styles.label}>Password</label>
// //               <input
// //                 type="password"
// //                 placeholder="Enter your password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 style={styles.input}
// //               />
// //             </div>

// //             {selectedRole === 'Faculty' && (
// //               <div style={styles.inputGroup}>
// //                 <label style={styles.label}>Session Year</label>
// //                 <select
// //                   value={sessionYear}
// //                   onChange={(e) => setSessionYear(e.target.value)}
// //                   style={styles.input}
// //                   required
// //                 >
// //                   <option value="">Select Session Year</option>
// //                   {sessionYears.map((y) => (
// //                     <option key={y} value={y}>
// //                       {y}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             )}

// //             {error && <div style={styles.errorContainer}>{error}</div>}

// //             <button
// //               type="submit"
// //               disabled={
// //                 !selectedRole ||
// //                 !email ||
// //                 !password ||
// //                 (selectedRole === 'Faculty' && !sessionYear)
// //               }
// //               style={{
// //                 ...styles.loginButton,
// //                 ...((!selectedRole ||
// //                   !email ||
// //                   !password ||
// //                   (selectedRole === 'Faculty' && !sessionYear))
// //                   ? styles.loginButtonDisabled
// //                   : {})
// //               }}
// //             >
// //               Sign In
// //             </button>
// //           </form>

// //           <div style={styles.footer}>
// //             <p style={styles.footerText}>
// //               © 2025 BTP Portal. All rights reserved. | NSUT Delhi
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles = {
// //   page: {
// //     display: 'flex',
// //     flexDirection: 'row',
// //     height: '100vh',
// //     width: '100vw',
// //     overflow: 'hidden',
// //     fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
// //     background:
// //       'radial-gradient(circle at top left, #1d4ed8 0, #020617 45%, #000000 100%)'
// //   },

// //   heroPane: {
// //     flexBasis: '40%',
// //     minWidth: 0,
// //     background:
// //       'radial-gradient(circle at top left, #1d4ed8 0, #020617 55%, #020617 100%)',
// //     display: 'flex',
// //     flexDirection: 'column',
// //     position: 'relative',
// //     overflow: 'hidden',
// //     boxShadow: '0 0 60px rgba(0,0,0,0.7)'
// //   },
// //    heroContent: {
// //     flex: 1,
// //     display: 'flex',
// //     flexDirection: 'column',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: '60px 40px',
// //     zIndex: 2,
// //     position: 'relative'
// //   },

// //   logoContainer: {
// //     width: 200,
// //     height: 200,
// //     marginBottom: 32,
// //     borderRadius: '50%',
// //     background: 'rgba(15,23,42,0.55)',
// //     backdropFilter: 'blur(16px)',
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     border: '1px solid rgba(148,163,184,0.7)',
// //     boxShadow: '0 18px 45px rgba(15,23,42,0.7)',
// //     overflow: 'hidden'
// //   },

// //   heroLogo: {
// //     width: '100%',
// //     height: '100%',
// //     objectFit: 'cover',
// //     borderRadius: '50%',
// //     backgroundColor: 'transparent'
// //   },

// //   heroText: {
// //     textAlign: 'center',
// //     color: 'white'
// //   },

// //   heroTitle: {
// //     fontSize: 32,
// //     fontWeight: 800,
// //     letterSpacing: '-0.02em',
// //     margin: '0 0 8px 0',
// //     textShadow: '0 2px 4px rgba(0,0,0,0.3)'
// //   },

// //   heroSubtitle: {
// //     fontSize: 18,
// //     fontWeight: 500,
// //     opacity: 0.9,
// //     margin: 0,
// //     letterSpacing: '0.5px'
// //   },

// //   heroGradient: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     height: '200px',
// //     background: 'linear-gradient(to top, rgba(30,58,138,1), transparent)',
// //     zIndex: 1
// //   },

// //   loginPane: {
// //     flex: 1,
// //     backgroundColor: '#f8fafc',
// //     display: 'flex',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: '40px 32px'
// //   },

// //   card: {
// //     width: '100%',
// //     maxWidth: 440,
// //     backgroundColor: '#ffffff',
// //     borderRadius: 24,
// //     padding: '48px 40px',
// //     boxShadow:
// //       '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05)',
// //     display: 'flex',
// //     flexDirection: 'column',
// //     gap: 32,
// //     backdropFilter: 'blur(20px)',
// //     position: 'relative',
// //     overflow: 'hidden'
// //   },

// //   header: {
// //     textAlign: 'center'
// //   },

// //   welcomeTitle: {
// //     fontSize: 28,
// //     fontWeight: 800,
// //     color: '#0f172a',
// //     margin: '0 0 8px 0',
// //     letterSpacing: '-0.025em'
// //   },

// //   welcomeSubtitle: {
// //     fontSize: 16,
// //     color: '#64748b',
// //     margin: 0,
// //     fontWeight: 500
// //   },

// //   roleSection: {
// //     textAlign: 'center'
// //   },

// //   roleLabel: {
// //     fontSize: 14,
// //     color: '#64748b',
// //     margin: '0 0 16px 0',
// //     fontWeight: 500,
// //     letterSpacing: '0.5px'
// //   },

// //   roleButtonsWrapper: {
// //     display: 'flex',
// //     justifyContent: 'center',
// //     gap: 16,
// //     flexWrap: 'wrap'
// //   },

// //   roleButton: {
// //     display: 'flex',
// //     alignItems: 'center',
// //     gap: 8,
// //     borderRadius: 14,
// //     padding: '12px 24px',
// //     border: '2px solid transparent',
// //     backgroundColor: '#f8fafc',
// //     color: '#475569',
// //     fontWeight: 600,
// //     cursor: 'pointer',
// //     fontSize: 15,
// //     transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
// //     boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
// //   },

// //   roleButtonActive: {
// //     background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
// //     color: 'white',
// //     borderColor: 'rgba(255,255,255,0.3)',
// //     boxShadow: '0 8px 25px rgba(30,58,138,0.4)',
// //     transform: 'translateY(-1px)'
// //   },

// //   form: {
// //     display: 'flex',
// //     flexDirection: 'column',
// //     gap: 24
// //   },

// //   inputGroup: {
// //     display: 'flex',
// //     flexDirection: 'column',
// //     gap: 6
// //   },

// //   label: {
// //     fontSize: 14,
// //     fontWeight: 600,
// //     color: '#374151',
// //     margin: 0,
// //     letterSpacing: '0.025em'
// //   },

// //   input: {
// //     width: '100%',
// //     padding: '14px 18px',
// //     borderRadius: 14,
// //     backgroundColor: '#fcfcfc',
// //     border: '2px solid #e2e8f0',
// //     fontSize: 15,
// //     color: '#1e293b',
// //     fontWeight: 500,
// //     outline: 'none',
// //     transition: 'all 0.2s ease',
// //     boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
// //   },

// //   errorContainer: {
// //     backgroundColor: '#fef2f2',
// //     color: '#dc2626',
// //     padding: '12px 16px',
// //     borderRadius: 12,
// //     borderLeft: '4px solid #dc2626',
// //     fontSize: 14,
// //     fontWeight: 500,
// //     lineHeight: 1.4
// //   },

// //   loginButton: {
// //     width: '100%',
// //     padding: '16px',
// //     borderRadius: 14,
// //     border: 'none',
// //     fontSize: 16,
// //     fontWeight: 700,
// //     background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
// //     color: 'white',
// //     cursor: 'pointer',
// //     transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
// //     boxShadow: '0 10px 25px rgba(30,58,138,0.3)',
// //     letterSpacing: '0.5px',
// //     position: 'relative',
// //     overflow: 'hidden'
// //   },

// //   loginButtonDisabled: {
// //     background: '#cbd5e1',
// //     color: '#94a3b8',
// //     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
// //     cursor: 'not-allowed',
// //     transform: 'none'
// //   },

// //   footer: {
// //     textAlign: 'center',
// //     paddingTop: 20,
// //     borderTop: '1px solid #f1f5f9'
// //   },

// //   footerText: {
// //     fontSize: 13,
// //     color: '#64748b',
// //     margin: 0,
// //     fontWeight: 500,
// //     letterSpacing: '0.3px'
// //   }
// // };

// // export default LoginPage;
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/axios'; // Assuming the path is correct
// import { useAuth } from '../../context/AuthContext'; // Assuming the path is correct
// import nsutLogo from '../../assets/nsut-logo.png'; // Assuming the path is correct

// const sessionYears = ['2025-2026', '2024-2025', '2023-2024', '2022-2023'];

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const roles = ['Faculty', 'Student'];

//   const [selectedRole, setSelectedRole] = useState(null);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [sessionYear, setSessionYear] = useState('');
//   const [error, setError] = useState('');

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
//       let roleForApi = selectedRole === 'Faculty' ? 'professor' : 'student';

//       const res = await api.post('/auth/login', {
//         email,
//         password,
//         role: roleForApi,
//         session: sessionYear || '2025-2026'
//       });

//       login(res.data);

//       const { role, mustChangePassword } = res.data.user;

//       if (mustChangePassword) {
//         navigate('/change-password');
//       } else if (role === 'professor') {
//         navigate('/professor');
//       } else if (role === 'student') {
//         navigate('/student');
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
//       {/* 🚀 Logo Pane (Left Side) - Now occupies the full left column */}
//       <div style={styles.logoPaneLg}>
//         <img
//           src={nsutLogo}
//           alt="NSUT Logo"
//           style={styles.logoLg}
//         />
//       </div>

//       {/* 🔐 Login Pane (Right Side) */}
//       <div style={styles.loginPane}>
//         <div style={styles.card}>

//           {/* Logo visible on small screens (Removed the explicit display:flex logic since inline styles don't handle media queries well) */}
//           <div style={styles.logoSmWrapper}>
//             <img
//               src={nsutLogo}
//               alt="NSUT Logo"
//               style={styles.logoSm}
//             />
//           </div>

//           <h2 style={styles.header}>
//             Sign In to BTP Portal
//           </h2>

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
//                     : styles.roleButtonInactive),
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
//                 {sessionYears.map((y) => (
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
//                   : styles.loginButtonActive),
//               }}
//             >
//               Login
//             </button>
//           </form>

//           <p style={styles.footer}>
//             © 2025 BTP Portal. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   // --- Page/Container Styles ---
//   page: {
//     display: 'flex',
//     height: '100vh',
//     width: '100vw',
//     fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//   },

//   // 🟢 LOGO PANE (MODIFIED)
//   logoPaneLg: {
//     // Occupies 33.33% of the width (1/3rd)
//     flexBasis: '33.3333%',
//     minWidth: '300px', // Ensures it looks good even if the viewport is huge
//     backgroundColor: '#1f2937', // Dark background (gray-900)
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '48px', // Increased padding for more breathing room
//     // Note: You would still need external CSS or JS logic to hide this on mobile devices.
//   },
//   logoLg: {
//     // Ensures the image scales within the pane without losing aspect ratio
//     maxHeight: '100%',
//     maxWidth: '100%',
//     objectFit: 'contain',
//   },

//   // --- Login Pane ---
//   loginPane: {
//     flex: 1, // Takes up the remaining space (2/3rd)
//     backgroundColor: '#f9fafb', // Light background (gray-50)
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '32px 24px',
//   },

//   // --- Card ---
//   card: {
//     width: '100%',
//     maxWidth: '420px',
//     backgroundColor: '#ffffff',
//     borderRadius: '16px',
//     padding: '32px 24px',
//     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '24px',
//   },

//   // --- Header ---
//   header: {
//     fontSize: '24px',
//     fontWeight: '700',
//     textAlign: 'center',
//     color: '#111827',
//     margin: '0',
//   },

//   // --- Small Logo (Conceptual Mobile Only) ---
//   logoSmWrapper: {
//     display: 'flex',
//     justifyContent: 'center',
//     marginBottom: '16px',
//     // In a final setup, this would be hidden on large screens
//     // '@media (min-width: 1024px)': { display: 'none' }
//   },
//   logoSm: {
//     width: '96px',
//     height: 'auto',
//     objectFit: 'contain',
//   },

//   // --- Role Buttons ---
//   roleButtonsWrapper: {
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '16px',
//     flexWrap: 'wrap',
//   },
//   roleButton: {
//     padding: '8px 16px',
//     borderRadius: '12px',
//     border: 'none',
//     fontWeight: '500',
//     fontSize: '14px',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease-in-out',
//     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//   },
//   roleButtonActive: {
//     backgroundColor: '#4f46e5',
//     color: '#ffffff',
//     boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.5)',
//     transform: 'scale(1.05)',
//   },
//   roleButtonInactive: {
//     backgroundColor: '#f3f4f6',
//     color: '#4b5563',
//   },

//   // --- Form ---
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },

//   // --- Inputs/Selects ---
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
//     transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
//     // Focus states would be added here via a CSS file
//   },

//   // --- Error Message ---
//   error: {
//     fontSize: '14px',
//     color: '#dc2626',
//     marginTop: '-8px',
//     marginBottom: '0',
//   },

//   // --- Login Button ---
//   loginButtonBase: {
//     width: '100%',
//     padding: '12px 16px',
//     borderRadius: '12px',
//     border: 'none',
//     fontSize: '18px',
//     fontWeight: '600',
//     transition: 'all 0.2s ease-in-out',
//   },
//   loginButtonActive: {
//     backgroundColor: '#4f46e5',
//     color: '#ffffff',
//     cursor: 'pointer',
//     boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)',
//   },
//   loginButtonDisabled: {
//     backgroundColor: '#e5e7eb',
//     color: '#9ca3af',
//     cursor: 'not-allowed',
//     boxShadow: 'none',
//   },

//   // --- Footer ---
//   footer: {
//     marginTop: '4px',
//     fontSize: '12px',
//     textAlign: 'center',
//     color: '#9ca3af',
//   }
// };

// export default LoginPage;
// client/src/pages/Auth/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import nsutLogo from '../../assets/nsut-logo.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const roles = ['Faculty', 'Student'];

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionYear, setSessionYear] = useState('');
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.get('/auth/sessions');
        setSessions(res.data); // ['2025-2026', ...]
      } catch (err) {
        console.error(err);
      }
    };
    loadSessions();
  }, []);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select Faculty or Student');
      return;
    }

    try {
      const roleForApi = selectedRole === 'Faculty' ? 'professor' : 'student';

      const res = await api.post('/auth/login', {
        email,
        password,
        role: roleForApi,
        session: sessionYear
      });

      // save token + user
      login(res.data);

      const { role, mustChangePassword } = res.data.user;

      if (role === 'professor') {
        if (mustChangePassword) {
          navigate('/professor/change-password', { replace: true });
        } else {
          navigate('/professor', { replace: true });
        }
      } else if (role === 'student') {
        navigate('/student', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const isLoginDisabled =
    !selectedRole ||
    !email ||
    !password ||
    (selectedRole === 'Faculty' && !sessionYear);

      const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={styles.page}>
      {/* Left logo pane */}
      <div style={styles.logoPaneLg}>
        <img src={nsutLogo} alt="NSUT Logo" style={styles.logoLg} />
      </div>

      {/* Right login pane */}
      <div style={styles.loginPane}>
        <div style={styles.card}>
          <div style={styles.logoSmWrapper}>
            <img src={nsutLogo} alt="NSUT Logo" style={styles.logoSm} />
          </div>

          <h2 style={styles.header}>Sign In to BTP Portal</h2>

          {/* Role buttons */}
          <div style={styles.roleButtonsWrapper}>
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleClick(r)}
                style={{
                  ...styles.roleButton,
                  ...(selectedRole === r
                    ? styles.roleButtonActive
                    : styles.roleButtonInactive)
                }}
              >
                {r} Login
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <div style={styles.divGroupFull}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
             <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.eyeicon}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
</div>
            {/* Faculty session dropdown */}
            {selectedRole === "Faculty" && (
              <select
                value={sessionYear}
                onChange={(e) => setSessionYear(e.target.value)}
                style={styles.input}
                required
              >
                <option value="">Select FY Year</option>
                {sessions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            )}

            {error && <p style={styles.error}>{error}</p>}

            <button
              type="submit"
              disabled={isLoginDisabled}
              style={{
                ...styles.loginButtonBase,
                ...(isLoginDisabled
                  ? styles.loginButtonDisabled
                  : styles.loginButtonActive)
              }}
            >
              Login
            </button>
          </form>

          <p style={styles.footer}>© 2025 BTP Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  logoPaneLg: {
    flexBasis: '33.3333%',
    minWidth: '300px',
    backgroundColor: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px'
  },
  logoLg: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
  },
  loginPane: {
    flex: 1,
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px 24px'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px 24px',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    fontSize: '24px',
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    margin: 0
  },
  logoSmWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  logoSm: {
    width: '96px',
    height: 'auto',
    objectFit: 'contain'
  },
  roleButtonsWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  roleButton: {
    padding: '8px 16px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  roleButtonActive: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.5)',
    transform: 'scale(1.05)'
  },
  roleButtonInactive: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    fontSize: '16px',
    color: '#1f2937',
    fontWeight: '500',
    outline: 'none',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
  },
  error: {
    fontSize: '14px',
    color: '#dc2626',
    marginTop: '-8px',
    marginBottom: 0
  },
  loginButtonBase: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '18px',
    fontWeight: '600',
    transition: 'all 0.2s ease-in-out'
  },
  loginButtonActive: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)'
  },
  loginButtonDisabled: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  footer: {
    marginTop: 4,
    fontSize: '12px',
    textAlign: 'center',
    color: '#9ca3af',
  },
  eyeicon: {
    position: "absolute",
    right: "14px",
    top: "49%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  divGroupFull: {
    position: "relative",
    width: "100%",
  },
};

export default LoginPage;
