import api, { setAccessToken } from "./client";


console.log("Access token has setup")
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  setAccessToken(res.data.accessToken);
  return res.data;
};

export const signupUser = async (data) => {
  return api.post("/auth/signup", data);
};


console.log("refreshing the token")
export const refreshToken = async () => {
  const res = await api.get("/auth/refresh");
  setAccessToken(res.data.accessToken);
  return res.data;
};
