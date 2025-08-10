import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../scss/homepage.scss";

const Homepage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNotes = async (page) => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/notes/all?page=${page}`);
        const data = res.data;
        if (data && data.success) {
          setNotes(data.notes || []);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
          setLoading(false);
        } else {
          console.error("노트 가져오기 실패:", data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("노트를 가져오는 중 문제 발생", error);
        setLoading(false);
      }
    };
    fetchNotes(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }
    return <div className="pagination">{pages}</div>;
  };

  return (
    <div className="homepage">
      {loading ? (
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          노트를 불러오는 중입니다...
        </h1>
      ) : (
        <>
          {notes.length > 0 ? (
            <>
              <div className="notes-grid">
                {notes.map((note) => (
                  <Link
                    to={`/notes/watch/${note._id}`}
                    key={note._id}
                    className="note-card"
                  >
                    <h2 className="title">{note.title}</h2>
                    <p className="content">{note.content}</p>
                  </Link>
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="no-notes">
              <h1>노트가 존재하지 않습니다!</h1>
              <Link to={`/notes/create`} className="create-note">
                새 노트 작성📝
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Homepage;
