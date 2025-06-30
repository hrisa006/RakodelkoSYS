/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { loginUser, logoutUser } from "../api/auth";

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const cookie = Cookies.get("auth_cookie");
    if (cookie) setUser(jwtDecode<User>(cookie));
  }, []);

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    await loginUser(username, password);
    const cookie = Cookies.get("auth_cookie");
    if (cookie) setUser(jwtDecode<User>(cookie));
  };

  const logout = async () => {
    await logoutUser();
    Cookies.remove("auth_cookie");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
