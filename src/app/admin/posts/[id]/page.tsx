'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import RichTextEditor from '@/components/RichTextEditor';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  categories: string[];
  author: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    status: 'draft',
    tags: '',
    categories: '',
    author: '',
    seoTitle: '',
    seoDescription: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const result = await response.json();
      
      if (result.success) {
        const post: BlogPost = result.data;
        setFormData({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage || '',
          status: post.status,
          tags: post.tags.join(', '),
          categories: post.categories.join(', '),
          author: post.author,
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || ''
        });
      } else {
        setError(result.error || 'Post not found');
      }
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle content change from rich text editor
  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  // Convert markdown-like syntax to HTML
  const convertToHTML = (text: string) => {
    return text
      // H1 Headers
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // H2 Headers
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 1rem 0;" />')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Bullet lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      // Paragraphs (for remaining text)
      .split('\n\n')
      .map(paragraph => {
        paragraph = paragraph.trim();
        if (!paragraph) return '';
        if (paragraph.includes('<h1>') || paragraph.includes('<h2>') || paragraph.includes('<ul>') || paragraph.includes('<img')) {
          return paragraph;
        }
        return `<p>${paragraph}</p>`;
      })
      .join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content: convertToHTML(formData.content),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          categories: formData.categories.split(',').map(cat => cat.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          router.push('/admin/posts');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(`Error: ${errorData.error || 'Failed to update post'}`);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
                  Edit Post
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-32 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D959B3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
                  Edit Post
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-32 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/admin/posts"
            className="bg-[#D959B3] text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg inline-block"
          >
            Back to Posts
          </Link>
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
                Edit Post
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/admin/posts"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                All Posts
              </Link>
              <Link 
                href="/admin"
                className="bg-transparent border border-[#D959B3] text-[#D959B3] px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#D959B3] hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <h2 className="text-xl font-medium mb-6" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>
              Basic Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                  placeholder="Enter your blog post title..."
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                  placeholder="url-friendly-version-of-title"
                />
                <p className="text-sm text-gray-500 mt-1">This will be part of your blog post URL.</p>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  id="excerpt"
                  rows={3}
                  required
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                  placeholder="Brief description that will appear on the blog listing page..."
                />
                <p className="text-sm text-gray-500 mt-1">This will be shown on the blog cards and in search results.</p>
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  id="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                  placeholder="Leave empty to use 'Fig.1 Team'"
                />
                <p className="text-sm text-gray-500 mt-1">Optional. Defaults to "Fig.1 Team" if left empty.</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <h2 className="text-xl font-medium mb-6" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>
              Content
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Content *
              </label>
              
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Edit your blog post content..."
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <h2 className="text-xl font-medium mb-6" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>
              Featured Image
            </h2>
            
            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="featuredImage"
                id="featuredImage"
                value={formData.featuredImage}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                placeholder="https://example.com/image.jpg or /local-image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">Enter the URL of your featured image (optional). Use images from /public folder or external URLs.</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <h2 className="text-xl font-medium mb-6" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>
              Metadata & SEO
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                    placeholder="AI, Marketing, Technology"
                  />
                </div>

                <div>
                  <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2">
                    Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="categories"
                    id="categories"
                    value={formData.categories}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                    placeholder="Insights, Trends"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                  placeholder="SEO-optimized title for search engines..."
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">Leave blank to use the main title. Max 60 characters.</p>
              </div>

              <div>
                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  name="seoDescription"
                  id="seoDescription"
                  rows={3}
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
                  placeholder="Meta description for search engines..."
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">Leave blank to use the excerpt. Max 160 characters.</p>
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="bg-white p-6 shadow-sm" style={{borderRadius: '22px'}}>
            <h2 className="text-xl font-medium mb-6" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#09090A'}}>
              Publish Settings
            </h2>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D959B3] focus:border-transparent"
              >
                <option value="draft">Draft (not visible to public)</option>
                <option value="published">Published (live on website)</option>
                <option value="archived">Archived (hidden from public)</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-between items-center">
            <Link 
              href="/admin/posts"
              className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium"
            >
              ← Back to Posts
            </Link>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/posts')}
                className="bg-transparent border border-gray-300 text-gray-700 px-6 py-3 rounded-full text-sm font-medium transition-colors hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style={{background: 'linear-gradient(90deg, #B8479E 0%, #E492D0 100%)'}}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Post'}
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">Post updated successfully!</p>
              <p className="text-green-600 text-sm mt-1">Redirecting to posts list...</p>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Error updating post.</p>
              <p className="text-red-600 text-sm mt-1">Please try again or contact support if the problem persists.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}