import BlogPost from "../models/blogPost.js";

/**
 * POST  /api/blog
 * Body  (JSON):
 *   {
 *     title, slug?, excerpt?, content_html, cover_image_url?,
 *     author: { name, email?, image? },
 *     categories?: [ { name } | "name" ],
 *     status?: draft|scheduled|published|archived,
 *     published_at?: ISODate,
 *     meta_title?, meta_description?
 *   }
 */

export const createBlogPost = async (req, res, next) => {
  try {
    /* ─────────────── Map request → model fields ─────────────── */
    const {
      title,
      slug,
      excerpt,
      content_html, // snake-case in incoming JSON
      cover_image_url,
      author,
      categories = [],
      status = "draft",
      published_at,
      meta_title,
      meta_description,
    } = req.body;

    /* Build the payload that matches the Mongoose schema */
    const postPayload = {
      title,
      slug, // auto-generated in schema if omitted
      excerpt,
      contentHtml: content_html,
      coverImageUrl: cover_image_url,
      author: {
        name: author?.name,
        email: author?.email,
        image: author?.image,
      },
      categories: categories.map((c) =>
        typeof c === "string" ? { name: c } : c
      ),
      status,
      publishedAt: published_at,
      metaTitle: meta_title,
      metaDescription: meta_description,
    };

    /* ─────────────── Persist ─────────────── */
    const post = await BlogPost.create(postPayload);

    return res.status(201).json(post); // 201 = Created
  } catch (err) {
    /* Handle duplicate slug gracefully */
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    /* Let global error middleware tackle the rest */
    return next(err);
  }
};
