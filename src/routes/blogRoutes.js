import { Router } from "express";
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blogPost.js";

const router = Router();

router.post("/", createBlogPost); // POST /api/blog
router.get("/", getBlogPosts); // GET /api/blog
router.get("/:slug", getBlogPostBySlug); // GET /api/blog/:slug
router.patch("/:id", updateBlogPost); // patch /api/blog/:id
router.delete("/:id", deleteBlogPost); // delete /api/blog/:id

export default router;
