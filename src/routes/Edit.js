import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";

const Edit = () => {
  const navigate = useNavigate();
  const [note, setNote] = useState({});
  const { id: noteId } = useParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { user, loading: authLoading } = useAuth();
  const [noteLoading, setNoteLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        `/api/notes/edit/${noteId}`,
        {
          title,
          content,
        },
        { withCredentials: true }
      );
      const data = res.data;
      if (data && data.success) {
        setMessage(data.message || "노트 편집 성공!");
        setIsSuccess(true);
        setTitle("");
        setContent("");
        setTimeout(() => {
          navigate(`/notes/watch/${noteId}`);
        }, 700);
      } else {
        setMessage(data?.message || "노트 편집에 실패했습니다.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "노트 편집 중 오류가 발생했습니다."
      );
      console.log(error);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        alert("로그인을 먼저 해주세요");
        navigate("/login");
      } else if (noteId) {
        const fetchNote = async () => {
          try {
            const res = await axios.get(`/api/notes/edit/${noteId}`, {
              withCredentials: true,
            });
            const data = res.data;
            if (data && data.success) {
              if (String(data.note.user) !== String(user.id)) {
                alert("노트 편집 권한이 없습니다.");
                navigate("/");
              } else {
                setNote(data.note);
                setTitle(data.note.title);
                setContent(data.note.content);
              }
            } else {
              navigate("/");
            }
          } catch (error) {
            console.log(error);
            navigate("/");
          } finally {
            setNoteLoading(false);
          }
        };
        if (noteId) {
          fetchNote();
        }
      }
    }
  }, [noteId, user, authLoading, navigate]);

  if (authLoading || noteLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="title">
          <label htmlFor="title">편집할 제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>

        <div className="content">
          <label htmlFor="content">편집할 내용</label>
          <input
            type="text"
            id="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
        <button type="submit">노트 편집</button>
        {message && (
          <p
            style={{
              color: isSuccess ? "green" : "red",
              fontWeight: "bold",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Edit;
