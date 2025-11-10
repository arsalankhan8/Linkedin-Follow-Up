import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import contactRoutes from "./routes/contactRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Use environment variable for frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// Routes
app.use('/api/auth', authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/templates", templateRoutes);
// Connect to DB and start server
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  );
});