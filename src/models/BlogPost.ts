import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private';
  tags: string[];
  categories: string[];
  author: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500
  },
  featuredImage: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  tags: [{
    type: String,
    trim: true
  }],
  categories: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    required: false,
    trim: true,
    default: 'Fig.1 Team'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  },
  readingTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ status: 1 });
BlogPostSchema.index({ visibility: 1 });
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ categories: 1 });

BlogPostSchema.pre('save', function(next) {
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  next();
});

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);