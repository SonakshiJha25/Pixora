import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { isCloudinaryConfigured } from "./services/cloudinaryService.js";
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

const allowedOrigins = ["http://localhost:5173"];
if (process.env.ALLOWED_ORIGINS) {
  for (const origin of process.env.ALLOWED_ORIGINS.split(",")) {
    const trimmed = origin.trim();
    if (trimmed) allowedOrigins.push(trimmed);
  }
}

app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
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

app.get("/health", (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.status(dbOk ? 200 : 503).json({
    success: dbOk,
    status: dbOk ? "ok" : "degraded",
    database: dbOk ? "connected" : "disconnected",
    databaseName: mongoose.connection?.db?.databaseName ?? null,
    cloudinary: isCloudinaryConfigured() ? "configured" : "missing",
  });
});

/** Optional: load from another host via <script src="https://your-api…/pixora-runtime.js"></script> before app bundle. */
function resolvePublicBackendOrigin() {
  const explicit = process.env.PUBLIC_BACKEND_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const railway = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (railway) {
    const host = railway.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    return `https://${host}`;
  }
  const renderUrl = process.env.RENDER_EXTERNAL_URL?.trim();
  if (renderUrl) return renderUrl.replace(/\/+$/, "");
  return "";
}

app.get("/pixora-runtime.js", (_req, res) => {
  res.type("application/javascript");
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  res.set("Cache-Control", "public, max-age=120");
  const origin = resolvePublicBackendOrigin();
  if (!origin) {
    res.send(
      '// Pixora: set PUBLIC_BACKEND_ORIGIN (full https origin) when the SPA loads from a separate host.'
    );
    return;
  }
  res.send(`globalThis.__PIXORA_API_BASE__=${JSON.stringify(origin)};\n`);
});

const clientDist = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDist)) {
  console.log("[server] Serving SPA from", clientDist);
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api") || req.path.startsWith("/generated")) return next();
    res.sendFile(path.join(clientDist, "index.html"), (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get("/", (_req, res) =>
    res.type("text/plain").send(
      "API working — build the React app into ../client/dist (npm run build from server/) to serve the web UI here."
    )
  );
}

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
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
