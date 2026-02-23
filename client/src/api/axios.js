
// import axios from "axios";

// const API_URL =
//   window.location.hostname === "localhost"
//     ? "http://localhost:5000/api"
//     : "https://btp-project-1.onrender.com/api";

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true
// });

// // Har request ke saath token auto bhejo
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

// 🔄 AUTO REFRESH IF ACCESS EXPIRES
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (err) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;