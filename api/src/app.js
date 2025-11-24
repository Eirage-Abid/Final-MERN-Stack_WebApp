import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { FRONTEND_URL } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Core middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // In development, allow any localhost origin
      if (process.env.NODE_ENV !== 'production') {
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }
      }
      
      // In production, use the configured FRONTEND_URL
      if (origin === FRONTEND_URL) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Error Handler
app.use(errorHandler);

export default app;
