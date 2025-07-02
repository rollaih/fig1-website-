'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private';
  author: string;
  createdAt: string;
  updatedAt: string;
  featuredImage?: string;
  tags: string[];
  categories: string[];
}

export default function PostsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?status=${filter}&visibility=all`);
      const result = await response.json();
      
      if (result.success) {
        setPosts(result.data);
      } else {
        setError(result.error || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        setPosts(posts.filter(post => post._id !== postId));
      } else {
        alert(result.error || 'Failed to delete post');
      }
    } catch (err) {
      alert('Failed to delete post');
      console.error('Error deleting post:', err);
    }
  };

  // No need to filter here since API already filters by status
  const filteredPosts = posts;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{backgroundColor: '#FFF5F5'}}>
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <Image
                    src="/Fig1_Finallogo.png"
                    alt="Fig1 Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto cursor-pointer"
                  />
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-2xl font-light" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A'}}>
                  All Posts
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D959B3] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FFF5F5'}}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Image
                  src="/Fig1_Finallogo.png"
                  alt="Fig1 Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto cursor-pointer"
                />
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-light" style={{fontFamily: 'var(--font-gowun-batang)', color: '#09090A'}}>
                All Posts
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/admin/posts/new"
                className="text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg"
                style={{backgroundColor: '#D959B3'}}
              >
                Create New Post
              </Link>
              <Link 
                href="/admin"
                className="bg-transparent border border-[#D959B3] text-[#D959B3] px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#D959B3] hover:text-white"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-[#D959B3] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                    {posts.filter(p => p.status === status).length}
                  </span>
                )}
                {status === 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                    {posts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't created any blog posts yet." 
                : `No ${filter} posts found.`}
            </p>
            <Link 
              href="/admin/posts/new"
              className="text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg inline-block"
              style={{backgroundColor: '#D959B3'}}
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post._id} className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow" style={{borderRadius: '22px'}}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-medium text-gray-900 hover:text-[#D959B3] transition-colors">
                        <Link href={`/admin/posts/${post._id}/edit`}>
                          {post.title}
                        </Link>
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.visibility === 'public' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {post.visibility === 'public' ? 'Public Post' : 'Private Case Study'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>By {post.author}</span>
                      <span>Created {formatDate(post.createdAt)}</span>
                      {post.updatedAt !== post.createdAt && (
                        <span>Updated {formatDate(post.updatedAt)}</span>
                      )}
                      <span>{post.tags.length} tags</span>
                    </div>
                    
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-6">
                    {post.status === 'published' && (
                      <Link 
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-[#D959B3] hover:text-[#B8479E] text-sm font-medium"
                      >
                        View Live
                      </Link>
                    )}
                    <Link 
                      href={`/admin/posts/${post._id}/edit`}
                      className="bg-transparent border border-[#D959B3] text-[#D959B3] px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-[#D959B3] hover:text-white"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination placeholder */}
        {filteredPosts.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 bg-[#D959B3] text-white rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}