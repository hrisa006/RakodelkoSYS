import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_cookie");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
