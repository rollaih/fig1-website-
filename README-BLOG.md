# Blog Admin System

A WordPress-like blog admin system built with Next.js, MongoDB Atlas, and Cloudflare R2 storage.

## Features

✅ **Completed Features:**
- 📝 **Blog Post Management**: Full CRUD operations for blog posts
- 🎨 **Admin Dashboard**: Clean, intuitive WordPress-like interface
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🏷️ **Tagging System**: Organize posts with tags and categories
- 📊 **Post Status**: Draft, Published, and Archived states
- 📈 **SEO Optimization**: Meta titles and descriptions
- ⏱️ **Reading Time**: Automatic calculation
- 🖼️ **Media Library**: Upload and manage images and files
- ☁️ **Cloud Storage**: Cloudflare R2 integration for media
- 🗄️ **Database**: MongoDB Atlas for data storage

🔄 **Planned Features:**
- 🔐 Authentication and user management
- 👥 Multiple author support
- 🔍 Search and filtering
- 📝 Rich text editor (WYSIWYG)
- 🌐 Public blog frontend with dynamic routing

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Storage**: Cloudflare R2
- **Deployment**: Ready for Vercel/Netlify

## Getting Started

### 1. Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Cloudflare R2 account

### 2. Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### 3. Environment Setup

Edit `.env.local` with your credentials:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog?retryWrites=true&w=majority

# Cloudflare R2
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-custom-domain.com
```

### 4. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your IP address
4. Get your connection string

### 5. Cloudflare R2 Setup

1. Create an R2 bucket
2. Generate API tokens with R2 permissions
3. (Optional) Set up a custom domain for public URLs

### 6. Run the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Admin Interface

Access the admin dashboard at: `http://localhost:3000/admin`

### Admin Features:

- **Dashboard**: Overview of posts and media
- **Posts**: Create, edit, delete, and manage blog posts
- **Media Library**: Upload and organize media files
- **Post Editor**: Rich form with SEO settings

### Creating Your First Post:

1. Go to `/admin/posts/new`
2. Fill in the title (slug auto-generates)
3. Add content and excerpt
4. Set tags, categories, and status
5. Configure SEO settings
6. Click "Create Post"

## API Endpoints

### Posts
- `GET /api/posts` - List posts with pagination
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Media
- `POST /api/media/upload` - Upload media files

## Database Schema

### BlogPost Model
```typescript
{
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  categories: string[];
  author: string;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Media Model
```typescript
{
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Project Structure

```
src/
├── app/
│   ├── admin/                 # Admin interface
│   │   ├── layout.tsx        # Admin layout
│   │   ├── page.tsx          # Dashboard
│   │   ├── posts/            # Post management
│   │   └── media/            # Media library
│   ├── api/                  # API routes
│   │   ├── posts/            # Post CRUD operations
│   │   └── media/            # Media upload
│   ├── blog/                 # Public blog pages
│   └── globals.css
├── components/               # Reusable components
├── lib/                     # Utility functions
│   ├── mongodb.ts           # Database connection
│   └── r2.ts               # R2 storage client
├── models/                  # Database models
│   ├── BlogPost.ts
│   └── Media.ts
└── types/                   # TypeScript definitions
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
Make sure to set all environment variables in your deployment platform.

## Contributing

This is a foundational blog system. Future enhancements could include:

- User authentication (NextAuth.js)
- Comment system
- Advanced rich text editor
- Email newsletters
- Analytics integration
- Multi-language support

## License

MIT License - feel free to use for personal or commercial projects.