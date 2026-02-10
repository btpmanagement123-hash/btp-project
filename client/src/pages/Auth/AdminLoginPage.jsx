import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import nsutLogo from '../../assets/nsutlogo.png';

const AdminLoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 960);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        ...form,
        role: 'admin',
        session: '2025-2026'
      });
      login(res.data);
      navigate('/admin');
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Admin authentication failed');
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
      <div style={styles.meshGradient} />

      <div style={{
        ...styles.contentWrapper,
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left',
        gap: isMobile ? '32px' : '60px',
      }}>
        
        {/* Left Side: Branding */}
        <div style={{
          ...styles.brandSection,
          alignItems: isMobile ? 'center' : 'flex-start',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            ...styles.logoContainer,
            width: isMobile ? '120px' : '160px',
            height: isMobile ? '120px' : '160px',
            borderRadius: isMobile ? '24px' : '40px',
            marginBottom: isMobile ? '20px' : '32px',
          }}>
            <img src={nsutLogo} alt="NSUT Logo" style={{
              ...styles.mainLogo,
              width: isMobile ? '80px' : '120px'
            }} />
          </div>
          <div style={styles.brandTextWrapper}>
            <h1 style={{
              ...styles.brandTitle,
              fontSize: isMobile ? '40px' : '64px',
              letterSpacing: isMobile ? '-1px' : '-3px',
            }}>Admin Portal</h1>
            <p style={{
              ...styles.brandSubtitle,
              fontSize: isMobile ? '16px' : '20px',
            }}>
              <span style={styles.highlightText}>NSUT BTP Academic Operations</span>
              <br /> Centralized Project Management System
            </p>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div style={{
          ...styles.loginCard,
          width: isMobile ? '100%' : '440px',
          maxWidth: isMobile ? '400px' : '440px',
          padding: isMobile ? '32px 24px' : '56px',
          borderRadius: isMobile ? '30px' : '40px',
        }}>
          <div style={styles.cardHeader}>
            <h2 style={styles.signInText}>Admin Access</h2>
            <p style={styles.signInSub}>Use your administrative credentials</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Admin Email</label>
              <input
                style={styles.input}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@nsut.ac.in"
                required
              />
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Master Password</label>
              <div style={styles.passwordContainer}>
                <input
                  style={styles.passwordInput}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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

            {error && <div style={styles.errorBanner}>{error}</div>}

            <button 
              type="submit" 
              disabled={loading} 
              style={loading ? styles.btnLoading : styles.btn}
            >
              {loading ? 'Authorizing...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    position: 'relative',
    overflowX: 'hidden',
    padding: '40px 20px',
    boxSizing: 'border-box',
  },
  meshGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundImage: `
      radial-gradient(at 0% 0%, hsla(210,100%,96%,1) 0, transparent 50%), 
      radial-gradient(at 100% 0%, hsla(220,100%,94%,1) 0, transparent 50%), 
      radial-gradient(at 0% 100%, hsla(215,100%,92%,1) 0, transparent 50%), 
      radial-gradient(at 100% 100%, hsla(230,100%,95%,1) 0, transparent 50%)
    `,
    opacity: 0.8,
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '1200px',
    zIndex: 1,
  },
  brandSection: {
    flex: 1,
  },
  logoContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.12)',
    border: '1px solid #f1f5f9',
    boxSizing: 'border-box',
  },
  mainLogo: {
    height: 'auto',
  },
  brandTitle: {
    fontWeight: '900',
    color: '#0f172a',
    margin: 0,
    lineHeight: '1',
  },
  brandSubtitle: {
    color: '#475569',
    lineHeight: '1.5',
    marginTop: '16px',
  },
  highlightText: {
    fontWeight: '700',
    color: '#334155',
    borderBottom: '3px solid #cbd5e1',
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.15)',
    border: '1px solid #ffffff',
    boxSizing: 'border-box',
  },
  cardHeader: {
    marginBottom: '32px',
  },
  signInText: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  signInSub: {
    fontSize: '15px',
    color: '#94a3b8',
    marginTop: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginLeft: '4px',
  },
  input: {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    border: '2px solid #f1f5f9',
    backgroundColor: '#f8fafc',
    fontSize: '15px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
  },
  // --- New Password Styles ---
  passwordContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    width: '100%',
    padding: '16px',
    paddingRight: '50px', // Extra space for the eye button
    borderRadius: '14px',
    border: '2px solid #f1f5f9',
    backgroundColor: '#f8fafc',
    fontSize: '15px',
    color: '#0f172a',
    outline: 'none',
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
    padding: '8px',
    zIndex: 2,
    outline: 'none',
  },
  // ---------------------------
  errorBanner: {
    backgroundColor: '#fff1f2',
    color: '#e11d48',
    padding: '14px',
    borderRadius: '14px',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center',
    border: '1px solid #ffe4e6',
  },
  btn: {
    marginTop: '12px',
    padding: '18px',
    borderRadius: '16px',
    border: 'none',
    background: '#0f172a', 
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
  },
  btnLoading: {
    backgroundColor: '#94a3b8',
    padding: '18px',
    borderRadius: '16px',
    border: 'none',
    color: '#fff',
    width: '100%',
  },
};

export default AdminLoginPage;