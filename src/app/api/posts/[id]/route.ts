import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const post = await BlogPost.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Find the post
    const post = await BlogPost.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
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
    
    // Check if slug already exists (excluding current post)
    if (body.slug !== post.slug) {
      const existingPost = await BlogPost.findOne({ slug: body.slug });
      if (existingPost) {
        return NextResponse.json(
          { success: false, error: 'A post with this slug already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update post
    const updatedPost = await BlogPost.findByIdAndUpdate(
      params.id,
      {
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
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: 'Post updated successfully'
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const deletedPost = await BlogPost.findByIdAndDelete(params.id);
    
    if (!deletedPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: deletedPost,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}