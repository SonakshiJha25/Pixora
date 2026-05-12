import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

if (!process.env.JWT_SECRET?.trim()) {
  console.error("JWT_SECRET is missing — set it in server/.env");
  process.exit(1);
}

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatedDir = path.join(__dirname, "public", "generated");
app.use(
  "/generated",
  express.static(generatedDir, {
    setHeaders(res) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.set("trust proxy", 1);

const generationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Too many generation attempts. Retry in a minute.",
    },
  },
});

app.use("/api/auth", authRouter);
app.use("/api/credits", creditRouter);
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/images", imageRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/image", generationLimiter, imageRouter);

app.get("/", (req, res) => res.send("API Working"));

app.get("/health", (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.status(dbOk ? 200 : 503).json({
    success: dbOk,
    status: dbOk ? "ok" : "degraded",
    database: dbOk ? "connected" : "disconnected",
    databaseName: mongoose.connection?.db?.databaseName ?? null,
  });
});

app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:");
    console.error(error);
    process.exit(1);
  }
}

startServer();
