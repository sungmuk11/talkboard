import AuthContext from "../contexts/AuthContext.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../scss/form.scss";

import { useAuth } from "../contexts/AuthContext.js";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (!username || !password) {
      setMessage("모든 필드를 채워주세요!");
      return;
    }

    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      const data = response && response.data;
      if (data && data.success) {
        login(data.user);
        setUsername("");
        setPassword("");
        setIsSuccess(true);
        setMessage("로그인 성공!");
        setTimeout(() => {
          navigate("/");
        }, 700);
      } else {
        setIsSuccess(false);
        setMessage(data?.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      setIsSuccess(false);
      const errorMessage =
        error.response?.data?.message || "로그인 중 오류가 발생했습니다.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="username">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="password">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">로그인</button>
        {message && (
          <p
            style={{
              color: isSuccess ? "green" : "red",
              textAlign: "center",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
