
// import axios from "axios";

// // Auto switch: localhost pe ho to local backend, warna Render backend
// const API_URL =
//   window.location.hostname === "localhost"
//     ? "http://localhost:5000/api"
//     : "https://btp-project-1.onrender.com/api";

// const api = axios.create({
//   baseURL: API_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("btp_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://btp-project-1.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Har request ke saath token auto bhejo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("btp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
