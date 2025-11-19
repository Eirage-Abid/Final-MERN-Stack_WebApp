import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // allow httpOnly cookie
});

// Store access token in memory
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = await api.get("/auth/refresh");
        const newToken = refresh.data.accessToken;

        setAccessToken(newToken);

        original.headers.Authorization = "Bearer " + newToken;

        return api(original);
      } catch (e) {
        setAccessToken(null);
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
