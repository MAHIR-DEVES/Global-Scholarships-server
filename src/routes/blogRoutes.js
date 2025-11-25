import { Router } from "express";
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
} from "../controllers/blogPost.js";

const router = Router();

router.post("/", createBlogPost); // POST /api/blog
router.get("/", getBlogPosts); // GET /api/blog
router.get("/id/:id", getBlogPostById); // GET /api/blog/id/:id
router.get("/:slug", getBlogPostBySlug); // GET /api/blog/:slug
router.patch("/:id", updateBlogPost); // patch /api/blog/:id
router.patch("/:id/like", likeBlogPost); // patch /api/blog/:id/like
router.delete("/:id", deleteBlogPost); // delete /api/blog/:id

export default router;
