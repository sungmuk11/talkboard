import Note from "../models/Note.js";

export const isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    return res
      .status(401)
      .json({ success: false, message: "로그인이 필요합니다" });
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    next();
  } else {
    return res
      .status(401)
      .json({ success: false, message: "로그인이 이미 되있습니다" });
  }
};

export const isNoteOwner = async (req, res, next) => {
  const currentUser = req.session.userId;
  const noteId = req.params.id;

  try {
    const note = await Note.findById(noteId);

    if (note && String(note.user) === String(currentUser)) {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "노트의 주인이 아닙니다" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};
