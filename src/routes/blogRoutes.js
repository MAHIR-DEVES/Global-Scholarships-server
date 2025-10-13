import { Router } from "express";
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostBySlug,
} from "../controllers/blogPost.js";

const router = Router();

router.post("/", createBlogPost); // POST /api/blog
router.get("/", getBlogPosts); // GET /api/blog
router.get("/:slug", getBlogPostBySlug); // GET /api/blog/:slug

export default router;
