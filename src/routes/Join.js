import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "../scss/form.scss";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Join = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const onClick = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !email || !password || !confirmPassword) {
      setIsSuccess(false);
      setMessage("모든 필드를 채워주세요!");
      return;
    }

    if (!validateEmail(email)) {
      setIsSuccess(false);
      setMessage("올바른 이메일 형식을 입력해주세요!");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("/api/join", {
        username,
        email,
        password,
      });

      const data = response.data;
      if (data.success) {
        setIsSuccess(true);
        setMessage("회원가입이 완료되었습니다!");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 700);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      setIsSuccess(false);
      console.error("에러:", error);
      const errorMessage =
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={onClick}>
        <div className="username">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="email">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="password">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="confirm-password">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit">회원가입</button>
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

export default Join;
