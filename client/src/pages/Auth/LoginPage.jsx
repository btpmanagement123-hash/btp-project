import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import nsutLogo from '../../assets/nsutlogo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Visibility state
  const [sessionYear, setSessionYear] = useState('');
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 850);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 850);
    window.addEventListener('resize', handleResize);
    
    const loadSessions = async () => {
      try {
        const res = await api.get('/auth/sessions');
        setSessions(res.data);
      } catch (err) {
        console.error("Session load failed", err);
      }
    };
    loadSessions();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const roleForApi = selectedRole === 'Faculty' ? 'professor' : 'student';
      const res = await api.post('/auth/login', { email, password, role: roleForApi, session: sessionYear });
      login(res.data);
      const { role, mustChangePassword } = res.data.user;
      if (role === 'professor') {
        navigate(mustChangePassword ? '/professor/change-password' : '/professor', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Custom SVG Eye Icon Component
  const EyeIcon = ({ visible }) => (
    visible ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    )
  );

  return (
    <div style={styles.page}>
      <div style={{
        ...styles.contentWrapper,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '40px' : '80px',
        padding: isMobile ? '20px' : '40px',
      }}>
        
        <div style={{
          ...styles.brandSection,
          textAlign: isMobile ? 'center' : 'left',
          alignItems: isMobile ? 'center' : 'flex-start'
        }}>
          <img src={nsutLogo} alt="NSUT Logo" style={{
            ...styles.mainLogo,
            width: isMobile ? '120px' : '180px'
          }} />
          <div style={{
            ...styles.brandTextWrapper,
            borderLeft: isMobile ? 'none' : '4px solid #4f46e5',
            borderTop: isMobile ? '4px solid #4f46e5' : 'none',
            paddingLeft: isMobile ? '0' : '20px',
            paddingTop: isMobile ? '15px' : '0',
          }}>
            <h1 style={{
              ...styles.brandTitle,
              fontSize: isMobile ? '32px' : '42px'
            }}>BTP Portal</h1>
            <p style={styles.brandSubtitle}>
              Netaji Subhas University of Technology <br />
              <span style={styles.departmentText}>Academic Management & Research</span>
            </p>
          </div>
        </div>

        <div style={{
          ...styles.loginCard,
          width: isMobile ? '100%' : '400px',
          maxWidth: '450px',
          padding: isMobile ? '24px' : '40px',
        }}>
          <div style={styles.cardHeader}>
            <h2 style={styles.signInText}>Welcome Back</h2>
            <p style={styles.signInSub}>Please enter your details to sign in</p>
          </div>

          <div style={styles.tabContainer}>
            {['Student', 'Faculty'].map((role) => (
              <div
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  ...styles.tab,
                  ...(selectedRole === role ? styles.activeTab : {})
                }}
              >
                {role}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="name@nsut.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            {/* Updated Password Field with Custom SVG Eye Icon */}
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.passwordInput}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={styles.eyeBtn}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {selectedRole === 'Faculty' && (
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Academic Session</label>
                <select
                  value={sessionYear}
                  onChange={(e) => setSessionYear(e.target.value)}
                  style={styles.input}
                  required
                >
                  <option value="">Select Session</option>
                  {sessions.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}

            {error && <div style={styles.errorBanner}>{error}</div>}

            <button 
              type="submit" 
              disabled={loading} 
              style={loading ? styles.btnLoading : styles.btn}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Existing styles kept for brevity, showing updated/new ones:
  passwordContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    width: '100%',
    padding: '14px',
    paddingRight: '45px', // Space for eye icon
    borderRadius: '12px',
    border: '2px solid #f1f5f9',
    backgroundColor: '#f8fafc',
    fontSize: '15px',
    color: '#1e293b',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    transition: 'color 0.2s ease',
    zIndex: 2,
    outline: 'none',
  },
  // Rest of your styles...
  page: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
    margin: 0,
    padding: '20px 0',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '90%',
    maxWidth: '1100px',
    boxSizing: 'border-box',
  },
  brandSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  mainLogo: {
    height: 'auto',
    marginBottom: '8px',
  },
  brandTitle: {
    fontWeight: '900',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-1.5px',
  },
  brandSubtitle: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.5',
    margin: '8px 0 0 0',
  },
  departmentText: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
    boxSizing: 'border-box',
  },
  cardHeader: {
    marginBottom: '32px',
    textAlign: 'left',
  },
  signInText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  signInSub: {
    fontSize: '14px',
    color: '#94a3b8',
    marginTop: '4px',
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    padding: '5px',
    borderRadius: '12px',
    marginBottom: '28px',
  },
  tab: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    color: '#4f46e5',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '2px solid #f1f5f9',
    backgroundColor: '#f8fafc',
    fontSize: '15px',
    color: '#1e293b',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  errorBanner: {
    backgroundColor: '#fff1f2',
    color: '#e11d48',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '13px',
    textAlign: 'center',
    border: '1px solid #ffe4e6',
  },
  btn: {
    marginTop: '10px',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  btnLoading: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    width: '100%',
  },
};

export default LoginPage;