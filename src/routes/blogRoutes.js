import { Router } from "express";
import { createBlogPost, getBlogPosts } from "../controllers/blogPost.js";

const router = Router();

router.post("/", createBlogPost); // POST /api/blog
router.get("/", getBlogPosts); // GET /api/blog

export default router;
