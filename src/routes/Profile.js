import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import "../scss/profile.scss";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState([]);
  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/profile/${id}`);
        const data = res.data;
        if (data && data.success) {
          setLoading(false);
          setUser(data.user);
          setNote(data.note);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (id) {
      getProfile();
    }
  }, [id]);

  return (
    <div className="profile-container">
      <div className="profile">
        <h1 className="profile-name">{user.username}님의 노트</h1>
        <div className="notes-container">
          {note.length > 0 ? (
            note.map((note) => (
              <Link
                to={`/notes/watch/${note._id}`}
                key={note._id}
                className="notes-card"
              >
                <h2 className="note-title">{note.title}</h2>
                <p className="note-content">{note.content}</p>
              </Link>
            ))
          ) : (
            <div className="any-notes">
              <h1>노트가 존재하지 않습니다!</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
