import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext.js";
import "../scss/header.scss";

const Header = () => {
  const { isLoggedIn, logout, loading } = useAuth();
  return (
    <header className="header">
      <Link to="/" className="home">
        <FontAwesomeIcon icon={faHouse} className="icon" />
      </Link>
      <div className="user-buttons">
        {loading ? (
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>로딩중...</h1>
        ) : (
          <>
            {isLoggedIn ? (
              <div className="user-info">
                <Link to="/notes/create" className="create">
                  새 노트 작성
                </Link>
                <button onClick={logout} className="logout">
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link to="/join" className="join">
                  회원가입
                </Link>
                <Link to="/login" className="login">
                  로그인
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
