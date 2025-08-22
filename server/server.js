import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import apiRouter from "./router/apiRouter.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = 5000;
const HOST = "0.0.0.0";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://todo-p11.fly.dev", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use("/api", apiRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "..", "build")));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB에 성공적으로 연결되었습니다!"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

app.listen(PORT, HOST, () => {
  console.log(`🚀 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
  console.log(`MongoDB URL: ${process.env.MONGO_URI}`);
});
