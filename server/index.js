import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "127.0.0.1";
const MONGODB_URI =
  process.env.mongodb_atlas_url ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/shoppingmall";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Shopping mall API server is running.",
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("mongodb 연결 성공");
  } catch (error) {
    console.error("mongodb 연결 실패:", error.message);
  }
};

const startServer = async () => {
  const server = app.listen(PORT, HOST, () => {
    console.log(`서버가 포트 ${PORT}에서 실행중입니다.`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
      return;
    }

    console.error("Server failed to start:", error.message);
  });

  connectDatabase();
};

startServer();
