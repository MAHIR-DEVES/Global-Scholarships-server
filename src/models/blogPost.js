import mongoose from "mongoose";
import slugify from "slugify";
import striptags from "striptags";

const { Schema } = mongoose;

/* ----------------------------------------------------
 * Sub-schemas
 * --------------------------------------------------*/
const AuthorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Invalid e-mail"],
    },
    image: { type: String },
  },
  { _id: false } // do not create a separate _id for the subdoc
);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/* ----------------------------------------------------
 * Blog-post schema
 * --------------------------------------------------*/
const BlogPostSchema = new Schema(
  {
    /* Core */
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    /* Content */
    excerpt: { type: String, trim: true },
    contentHtml: { type: String, required: true },
    coverImageUrl: [{ type: String }],

    /* Relationships */
    author: { type: AuthorSchema, required: true },
    categories: { type: [CategorySchema], default: [] },

    /* Life-cycle */
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },

    /* SEO */
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    versionKey: false, // no __v field
  }
);

/* ----------------------------------------------------
 * Middleware
 * --------------------------------------------------*/

// Auto-generate the slug (only on new docs or when title changes).
BlogPostSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Auto-generate metaDescription if left blank.
BlogPostSchema.pre("save", function (next) {
  if (!this.metaDescription || this.metaDescription.trim().length === 0) {
    const MAX = 160;
    const source =
      this.excerpt && this.excerpt.trim().length > 0
        ? this.excerpt
        : striptags(this.contentHtml).replace(/\s+/g, " ").trim();

    if (source.length <= MAX) {
      this.metaDescription = source;
    } else {
      // cut on the last space before the limit
      this.metaDescription =
        source
          .slice(0, MAX + 1)
          .split(" ")
          .slice(0, -1)
          .join(" ") + "…";
    }
  }
  next();
});

BlogPostSchema.index({ title: "text" });
BlogPostSchema.index({ slug: "text" });
BlogPostSchema.index({ "author.name": "text" });
BlogPostSchema.index({ "author.email": "text" });
BlogPostSchema.index({ status: 1 });
BlogPostSchema.index({ publishedAt: 1 });

export default mongoose.model("BlogPost", BlogPostSchema);
