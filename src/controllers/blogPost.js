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
    const postPayload = {
      ...req.body,
      author: {
        ...req.body.author,
        image: req.body.author?.image || undefined, // Handle null
      },
      categories: (req.body.categories || []).map((c) =>
        typeof c === "string" ? { name: c } : c
      ),
    };

    const post = await BlogPost.create(postPayload);
    return res
      .status(201)
      .json({ data: post, message: "Blog successfully created" });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(409).json({ message: "Slug already exists" });
    }
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

/* ----------------------------------------------------------------
 * 3.5.  GET BY ID – GET /api/blog/id/:id
 * ----------------------------------------------------------------*/
export const getBlogPostById = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json(post);
  } catch (err) {
    return next(err);
  }
};

/* ================================================================
 * 4. UPDATE  – PUT /api/blog/:id            (full or partial)
 * ===============================================================*/
export const updateBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* ---> Security hint:
       Pick only fields you’re willing to let the client change   */
    const ALLOWED = [
      "title",
      "excerpt",
      "contentHtml",
      "coverImageUrl",
      "categories",
      "status",
      "publishedAt",
      "metaTitle",
      "metaDescription",
    ];

    const payload = ALLOWED.reduce((obj, key) => {
      if (req.body[key] !== undefined) obj[key] = req.body[key];
      return obj;
    }, {});

    const post = await BlogPost.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    next(err);
  }
};

/* ================================================================
 * 5. DELETE  – DELETE /api/blog/:id
 * ===============================================================*/
export const deleteBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* Hard-delete (physically removes doc) */
    const result = await BlogPost.findByIdAndDelete(id);

    if (!result) return res.status(404).json({ message: "Post not found" });

    /* 🔀  Prefer “soft delete”?  Replace the two lines above with:
       const result = await BlogPost.findByIdAndUpdate(
         id,
         { status: 'archived' },
         { new: true }
       );
    */

    res.json({ message: "Post deleted", id: result._id });
  } catch (err) {
    next(err);
  }
};

/* ================================================================
 * 6. LIKE  – PATCH /api/blog/:id/like
 * ===============================================================*/
export const likeBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const increment = action === "unlike" ? -1 : 1;

    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { likes: increment } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
};
