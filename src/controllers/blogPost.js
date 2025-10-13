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

/* ----------------------------------------------------------------
 * 2.  LIST  – GET /api/blog
 * ----------------------------------------------------------------
 * Query-params:
 *   ?page=1&limit=10&status=published&category=Application%20Tips&q=essay
 * ----------------------------------------------------------------*/
export const getBlogPosts = async (req, res, next) => {
  try {
    /* --------- Parse query params ---------- */
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); // hard-cap 50
    const status = req.query.status ?? "published"; // default
    const category = req.query.category; // optional
    const searchQ = req.query.q; // optional text search

    /* --------- Build Mongo filter ---------- */
    const filter = {};
    if (status) filter.status = status;
    if (category) filter["categories.name"] = category;
    if (searchQ) filter.$text = { $search: searchQ }; // requires text index (see **Note**)

    /* --------- Execute query ---------- */
    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1 }) // newest first
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-contentHtml") // omit heavy field in list view
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    return res.json({
      data: posts,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return next(err);
  }
};

/* ----------------------------------------------------------------
 * 3.  DETAIL – GET /api/blog/:slug
 * ----------------------------------------------------------------*/
export const getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: "published", // only published are public
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.json(post);
  } catch (err) {
    return next(err);
  }
};
