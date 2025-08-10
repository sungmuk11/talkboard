import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";

export const IsLoggedIn = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const IsNotLoggedIn = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};
