import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../scss/create.scss";

const Create = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const createNote = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setIsSuccess(false);
      setMessage("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post("/api/notes/create", {
        title,
        content,
      });

      const data = res && res.data;
      if (data && data.success) {
        setTitle("");
        setContent("");
        setIsSuccess(true);
        setMessage(data.message || "노트가 성공적으로 생성되었습니다!");
        navigate("/");
      } else {
        setIsSuccess(false);
        setMessage(data?.message || "노트 생성에 실패했습니다.");
        console.error("노트 생성 실패:", data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "노트 생성 중 오류가 발생했습니다.";
      setIsSuccess(false);
      setMessage(errorMessage || "노트 생성 중 오류가 발생했습니다.");
      console.error("Error creating note:", error);
    }
  };
  return (
    <div className="create-container">
      <form className="create-note" onSubmit={createNote}>
        <div className="form-group">
          <label htmlFor="title">노트 제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">노트 내용</label>
          <input
            type="text"
            id="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="submit-button">
          노트 작성
        </button>
        {message && (
          <p
            className="message"
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

export default Create;
