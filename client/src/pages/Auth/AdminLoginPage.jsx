import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import nsutLogo from '../../assets/nsutlogo.png';

const AdminLoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      setError(err.response?.data?.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.meshGradient} />

      <div style={styles.contentWrapper}>
        {/* Left Side: Branding with Bigger Logo */}
        <div style={styles.brandSection}>
          <div style={styles.logoContainer}>
            <img src={nsutLogo} alt="NSUT Logo" style={styles.mainLogo} />
          </div>
          <div style={styles.brandTextWrapper}>
            <h1 style={styles.brandTitle}>Admin Portal</h1>
            <p style={styles.brandSubtitle}>
              <span style={styles.highlightText}>NSUT BTP Academic Operations</span>
              <br /> Centralized Project Management System
            </p>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div style={styles.loginCard}>
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
              <input
                style={styles.input}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
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
    height: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    position: 'relative',
    overflow: 'hidden',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%',
    maxWidth: '1200px',
    zIndex: 1,
    gap: '60px',
  },
  brandSection: {
    flex: 1,
    textAlign: 'left',
  },
  logoContainer: {
    width: '160px', // Bada container
    height: '160px',
    backgroundColor: '#fff',
    borderRadius: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.12)',
    marginBottom: '32px',
    border: '1px solid #f1f5f9',
  },
  mainLogo: {
    width: '120px', // Bada logo size
    height: 'auto',
  },
  brandTitle: {
    fontSize: '64px',
    fontWeight: '900',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-3px',
    lineHeight: '0.9',
  },
  brandSubtitle: {
    fontSize: '20px',
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
    width: '440px',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '40px',
    padding: '56px',
    boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.15)',
    border: '1px solid #ffffff',
  },
  cardHeader: {
    marginBottom: '40px',
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
    gap: '24px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginLeft: '4px',
  },
  input: {
    width: '100%',
    padding: '18px',
    borderRadius: '16px',
    border: '2px solid #f1f5f9',
    backgroundColor: '#f8fafc',
    fontSize: '15px',
    color: '#0f172a',
    outline: 'none',
    transition: '0.2s all ease',
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: '#0f172a',
      backgroundColor: '#fff',
    }
  },
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
    padding: '20px',
    borderRadius: '18px',
    border: 'none',
    background: '#0f172a', 
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
    transition: 'all 0.2s ease',
  },
  btnLoading: {
    backgroundColor: '#94a3b8',
    padding: '20px',
    borderRadius: '18px',
    border: 'none',
    color: '#fff',
    width: '100%',
  },
};

export default AdminLoginPage;