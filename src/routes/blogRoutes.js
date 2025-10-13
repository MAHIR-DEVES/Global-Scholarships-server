import { Router } from "express";
import { createBlogPost } from "../controllers/blogPost.js";

const router = Router();

router.post("/", createBlogPost); // POST /api/blog

export default router;
