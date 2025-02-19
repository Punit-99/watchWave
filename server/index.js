import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import authRoutes from "./routes/auth/auth-routers.js";
import adminRoutes from "./routes/admin/show-routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
const BASE_URL = "/api/v1";
// auth-routes
app.use(`${BASE_URL}/auth`, authRoutes);

// admin-routes
app.use(`${BASE_URL}/admin/shows`, adminRoutes);

// user-routes

// start
const startServer = () => {
  connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
  });
};

startServer();
