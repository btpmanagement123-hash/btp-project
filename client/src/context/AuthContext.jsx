
// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       const stored = localStorage.getItem('btp_user');
//       return stored ? JSON.parse(stored) : null;
//     } catch {
//       return null;
//     }
//   });

//   const login = (data) => {
//     localStorage.setItem('btp_token', data.token);
//     localStorage.setItem('btp_user', JSON.stringify(data.user));
//     setUser(data.user);
//   };

//   const logout = () => {
//     localStorage.removeItem('btp_token');
//     localStorage.removeItem('btp_user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('btp_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // 🔐 Login (token handled by HttpOnly cookies automatically)
  const login = (data) => {
    localStorage.setItem('btp_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  // 🔓 Logout (clear cookies via backend)
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    }

    localStorage.removeItem('btp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);