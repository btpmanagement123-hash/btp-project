// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',   // direct full URL
// });

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('btp_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
import axios from "axios";

// Auto switch: localhost pe ho to local backend, warna Render backend
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://btp-project-1.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("btp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
