import api from "./axios";

export const loginUser = (username: string, password: string) =>
  api.post("/auth/login", { username, password });

export const registerUser = (username: string, password: string) =>
  api.post("/auth/register", { username, password });

export const logoutUser = () => api.post("/auth/logout");
