import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";

import "../scss/notes.scss";
import axios from "axios";

const Notes = () => {
  const navigate = useNavigate();
  const { id: noteId } = useParams();
  const { user } = useAuth();
  const [note, setNote] = useState({});
  const [owner, setOwner] = useState({});
  const [loading, setLoading] = useState(false);
  const date = new Date(note.createdAt);

  const onClick = async () => {
    try {
      const res = await axios.delete(`/api/notes/delete/${noteId}`);
      const data = res.data;
      if (data && data.success) {
        navigate("/");
      } else {
        console.log("노트 삭제 실패");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const noteOwner = async () => {
      if (note.user) {
        try {
          setLoading(true);
          const res = await axios.get(`/api/notes/owner/${note.user}`);
          const data = res.data;

          if (data && data.success) {
            setOwner(data.owner);
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }
    };
    noteOwner();
  }, [note.user]);

  useEffect(() => {
    const bringNotes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/notes/watch/${noteId}`);
        const data = res.data;
        if (data && data.success) {
          setNote(data.note);
          setLoading(false);
        } else {
          navigate("/");
          setLoading(false);
        }
      } catch (error) {
        navigate("/");
        console.log("에러:", error);
        setLoading(false);
      }
    };
    bringNotes();
  }, []);

  return (
    <div className="note-container">
      {loading ? (
        <h1 style={{ fontSize: "27px", fontWeight: "bold" }}>로딩중...</h1>
      ) : (
        <>
          <div className="note">
            <div className="note-top">
              <div className="note-top-header">
                {loading ? (
                  <span style={{ fontSize: "26px", fontWeight: "bold" }}>
                    로딩중...
                  </span>
                ) : (
                  <>
                    <Link to={`/profile/${owner._id}`} className="user">
                      <span>{owner.username}</span>
                    </Link>
                    <span>님의 글</span>
                  </>
                )}
              </div>
              <div className="title">{note.title}</div>
            </div>
            <div className="content">{note.content}</div>
            <div className="note-info-container">
              <div className="note-info">
                {user && String(note.user) === String(user.id) && (
                  <>
                    <Link to={`/notes/edit/${note._id}`} className="edit">
                      노트편집
                    </Link>
                    <button onClick={onClick}>노트삭제</button>
                  </>
                )}
                <div className="createdAt">
                  {date.toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notes;
