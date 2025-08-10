import express from "express";
import {
  join,
  login,
  logout,
  profile,
  checkStatus,
} from "../controllers/userController.js";

import {
  createNotes,
  bringNotes,
  watchNote,
  getNote,
  editNote,
  deleteNote,
  noteOwner,
} from "../controllers/noteController.js";
import {
  isLoggedIn,
  isNotLoggedIn,
  isNoteOwner,
} from "../middleware/middleware.js";

const apiRouter = express.Router();

//노트 부분
apiRouter.post("/notes/create", isLoggedIn, createNotes);
apiRouter.get("/notes/all", bringNotes);
apiRouter.get("/notes/watch/:id", watchNote);
apiRouter.get("/notes/edit/:id", isLoggedIn, isNoteOwner, getNote);
apiRouter.patch("/notes/edit/:id", isLoggedIn, isNoteOwner, editNote);
apiRouter.delete("/notes/delete/:id", isLoggedIn, isNoteOwner, deleteNote);
apiRouter.get("/notes/owner/:id", noteOwner);

// 사용자 부분
apiRouter.post("/join", isNotLoggedIn, join);
apiRouter.post("/login", isNotLoggedIn, login);
apiRouter.get("/profile/:id", profile);
apiRouter.post("/auth/logout", isLoggedIn, logout);
apiRouter.get("/auth/status", checkStatus);

export default apiRouter;
