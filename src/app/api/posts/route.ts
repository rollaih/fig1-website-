import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const visibility = searchParams.get('visibility');
    const limit = searchParams.get('limit');
    
    let query: any = {};
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by visibility if provided, default to public for non-admin requests
    if (visibility && visibility !== 'all') {
      query.visibility = visibility;
    } else if (!visibility) {
      // If no visibility filter is specified, default to public posts only
      query.visibility = 'public';
    }
    
    let postsQuery = BlogPost.find(query).sort({ createdAt: -1 });
    
    // Limit results if provided
    if (limit) {
      postsQuery = postsQuery.limit(parseInt(limit));
    }
    
    const posts = await postsQuery.exec();
    
    return NextResponse.json({
      success: true,
      data: posts,
      total: posts.length
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'content', 'excerpt'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug: body.slug });
    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Create new post
    const newPost = new BlogPost({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      status: body.status || 'draft',
      visibility: body.visibility || 'public',
      author: body.author || 'Fig.1 Team',
      featuredImage: body.featuredImage || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      categories: Array.isArray(body.categories) ? body.categories : [],
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null
    });
    
    const savedPost = await newPost.save();
    
    return NextResponse.json({
      success: true,
      data: savedPost,
      message: 'Post created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}