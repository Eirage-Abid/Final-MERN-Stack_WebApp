import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // allow httpOnly cookie
});

// Store access token in memory
let accessToken = null;
//let isRefreshing = false; // Added to track if a refresh is already in progress


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

    if (err.response?.status === 401 && !original._retry /*&& !isRefreshing*/) {
      original._retry = true;
     // isRefreshing = true; // Mark that refresh is in progress



      try {
        console.log("Refreshing token...");
        const refresh = await api.get("/auth/refresh");

        console.log("Refresh response:", refresh.data);
        const newToken = refresh.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        setAccessToken(newToken);
// Made changes here from orignal.headers.Authorization = "Bearer + newToken"
        original.headers["Authorization"] = `Bearer  ${newToken}`;
        

      //  isRefreshing = false;
        return api(original);

      } catch (e) {
        console.log("Refresh failed:", e.response?.data);
        localStorage.removeItem("accessToken");
        document.cookie = "refreshToken=; path=/";  // Clear the refresh token cookie
        setAccessToken(null);
       // isRefreshing = false; // Reset the flag
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
