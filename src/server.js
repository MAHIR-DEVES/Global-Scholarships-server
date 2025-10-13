import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

// require("dotenv").config();
dotenv.config();
// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/blog", blogRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is working!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler for Express v5
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// Export the app for Vercel
export default app;

// Start server (only for local development)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
