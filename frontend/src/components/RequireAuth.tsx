import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { JSX } from "react";

/**
 * Guard за защитени маршрути.
 * Ако user == null  → редирект към /login, запазвайки текущия URL.
 * Иначе рендерира child компонентите.
 */
const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
  }

  return children;
};

export default RequireAuth;
