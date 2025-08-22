import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // .env 파일에서 환경 변수를 로드합니다.

const mongoUri =
  "mongodb+srv://sungm00k0310:6Inzn3PAi7CeiEWa@talkboard.vd8tlom.mongodb.net/?retryWrites=true&w=majority&appName=talkboard";

if (!mongoUri) {
  console.error("MONGO_URI 환경 변수가 설정되지 않았습니다.");
  process.exit(1);
}

mongoose
  .connect(mongoUri, {})
  .then(() => {
    console.log("✅ MongoDB에 성공적으로 연결되었습니다!");
    mongoose.connection.close(); // 연결 후 닫습니다.
  })
  .catch((err) => {
    console.error("❌ MongoDB 연결 실패:", err);
    process.exit(1);
  });
