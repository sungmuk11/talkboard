import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/auth/status", {
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.user);
          setIsLoggedIn(true);
          setLoading(false);
        } else {
          setIsLoggedIn(false);
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
        setLoading(false);
        return;
      }
    };
    checkLoginStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setLoading(false);
    console.log(
      "AuthContext: login 함수 호출됨, 사용자 이름:",
      userData.username
    );
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("AuthContext: 로그아웃 중 오류 발생:", error);
    }
    setUser(null);
    setIsLoggedIn(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
