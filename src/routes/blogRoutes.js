import { Router } from "express";
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
} from "../controllers/blogPost.js";

const router = Router();

router.post("/", createBlogPost); // POST /api/blog
router.get("/", getBlogPosts); // GET /api/blog
router.get("/:slug", getBlogPostBySlug); // GET /api/blog/:slug
router.patch("/:id", updateBlogPost); // GET /api/blog/:slug

export default router;
