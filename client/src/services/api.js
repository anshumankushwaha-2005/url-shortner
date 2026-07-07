import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the auth token (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("snipify_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is rejected, clear it so the app falls back to logged-out state.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("snipify_token");
    }
    return Promise.reject(err);
  }
);

/* -------------------- Auth -------------------- */
export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (name, email, password) => api.post("/auth/register", { name, email, password }),
  me: () => api.get("/auth/me"),
};

/* -------------------- URLs -------------------- */
export const urlApi = {
  list: () => api.get("/urls"),
  create: (payload) => api.post("/urls", payload),
  remove: (id) => api.delete(`/urls/${id}`),
  update: (id, payload) => api.patch(`/urls/${id}`, payload),
};

/* -------------------- Analytics -------------------- */
export const analyticsApi = {
  forUrl: (id) => api.get(`/analytics/${id}`),
};

export default api;
