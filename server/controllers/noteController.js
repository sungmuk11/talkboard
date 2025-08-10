import Note from "../models/Note.js";
import User from "../models/User.js";

export const createNotes = async (req, res) => {
  const { title, content } = req.body;
  try {
    const Newnote = new Note({
      title,
      content,
      user: req.session.userId,
    });
    await Newnote.save();

    return res.status(201).json({
      success: true,
      message: "노트가 성공적으로 생성되었습니다!",
    });
  } catch (error) {
    console.error("Error creating note:", error);
    return res
      .status(500)
      .json({ success: false, message: "노트 생성 중 오류가 발생했습니다." });
  }
};

export const bringNotes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const notes = await Note.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
      
    const totalNotes = await Note.countDocuments({});
    const totalPages = Math.ceil(totalNotes / limit);

    return res.status(200).json({
      success: true,
      notes,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      success: false,
      message: "노트 가져오기 중 오류가 발생했습니다.",
    });
  }
};

export const watchNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ success: false });
    }
    return res.status(200).json({ success: true, note });
  } catch (error) {
    console.log(error);
  }
};

export const editNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  console.log(id, title, content);

  try {
    const editNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!editNote) {
      return res
        .status(404)
        .json({ success: false, message: "노트가 존재하지 않습니다." });
    }
    return res.status(200).json({ success: true, message: "노트 편집 성공!" });
  } catch (error) {
    console.log("에러:", error);
    return res
      .status(200)
      .json({ success: false, message: "노트 편집중 오류 발생." });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.session.userId;
  try {
    if (!currentUserId) {
      return res
        .status(401)
        .json({ success: false, message: "로그인이 필요합니다." });
    }
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ success: false });
    }
    if (String(currentUserId) !== String(note.user)) {
      return res.status(403).json({ success: false });
    }
    await Note.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

export const noteOwner = async (req, res) => {
  const { id } = req.params;
  try {
    const noteOwner = await User.findById(id);
    if (!noteOwner) {
      return res.status(404).json({ success: false });
    }
    return res.status(200).json({ success: true, owner: noteOwner });
  } catch (error) {
    console.log(error);
  }
};
