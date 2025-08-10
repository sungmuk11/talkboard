import User from "../models/User.js";
import Note from "../models/Note.js";
import bcrypt from "bcryptjs";

export const join = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res
          .status(400)
          .json({ success: false, message: "이미 사용중인 유저 이름입니다." });
      }
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ success: false, message: "이미 사용중인 이메일입니다." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "회원가입이 완료되었습니다!" });
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    return res
      .status(500)
      .json({ success: false, message: "회원가입 중 오류가 발생했습니다." });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      username,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "존재하지 않는 유저입니다." });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(401)
        .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }

    req.session.userId = user._id;
    req.session.isLoggedIn = true;
    return res.status(200).json({
      success: true,
      message: "로그인 성공!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    return res
      .status(500)
      .json({ success: false, message: "로그인 중 오류가 발생했습니다." });
  }
};

export const logout = (req, res) => {
  if (req.session.userId) {
    req.session.destroy((err) => {
      if (err) {
        console.error("로그아웃 중 오류 발생:", err);
        return res.status(500).json({
          success: false,
          message: "로그아웃 중 오류가 발생했습니다.",
        });
      }
      return res.status(200).json({ success: true, message: "로그아웃 성공!" });
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "로그인 상태가 아닙니다." });
  }
};

export const checkStatus = (req, res) => {
  if (req.session.userId) {
    return res.status(200).json({
      success: true,
      user: {
        id: req.session.userId,
      },
    });
  } else {
    return res.status(401).json({
      success: false,
    });
  }
};

export const profile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    const userNote = await Note.find({ user: id });
    if (!userNote) {
      return res.status(404).json({ success: false });
    }
    if (!user) {
      return res.status(404).json({ success: false });
    }
    return res.status(200).json({ success: true, note: userNote, user });
  } catch (error) {
    console.log(error);
  }
};
